import { namedPokeAPIResourceSchema, pokemonSchema } from '@/schemas';
import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

type RelationPrefix = 'double' | 'half' | 'no';
type RelationSuffix = 'from' | 'to';
type PokemonTypeRelation = Record<string, number>;

const relationMultipliers: Record<RelationPrefix, number> = {
  double: 2,
  half: 0.5,
  no: 0,
};

const getRelationParts = (relation: string) => {
  const splitRelation = relation.split('_');
  const relationPrefix = splitRelation[0] as RelationPrefix;
  const relationSuffix = splitRelation[splitRelation.length - 1] as RelationSuffix;

  return [relationPrefix, relationSuffix] as const;
};

function normalizeDamageRelations(relations: DamageRelations) {
  const normalized: Record<RelationSuffix, PokemonTypeRelation> = {
    to: {},
    from: {},
  };

  Object.entries(relations).forEach(([relation, types]) => {
    const [prefix, suffix] = getRelationParts(relation);

    types.forEach(({ name }) => {
      normalized[suffix][name] = relationMultipliers[prefix];
    });
  });

  return normalized;
}

function combineDefensiveDamageRelations(
  mainRelation: PokemonTypeRelation,
  secondaryRelation: PokemonTypeRelation,
) {
  const combined: PokemonTypeRelation = {};

  Object.entries(mainRelation).forEach(([type, multiplier]) => {
    const secondaryRelationMultiplier = secondaryRelation[type];
    const newMultiplier = multiplier * (secondaryRelationMultiplier || 1);

    if (newMultiplier === 1) {
      if (type in combined) {
        delete combined[type];
      }
    } else {
      combined[type] = newMultiplier;
    }
  });

  Object.entries(secondaryRelation).forEach(([type, multiplier]) => {
    if (!(type in mainRelation)) {
      combined[type] = multiplier;
    }
  });

  return combined;
}

function combineOffensiveDamageRelations(
  mainRelation: PokemonTypeRelation,
  secondaryRelation: PokemonTypeRelation,
) {
  const combined: PokemonTypeRelation = {};

  Object.entries(mainRelation).forEach(([type, multiplier]) => {
    const secondaryRelationMultiplier = secondaryRelation[type];
    if (secondaryRelationMultiplier >= 0) {
      combined[type] =
        secondaryRelationMultiplier > multiplier ? secondaryRelationMultiplier : multiplier;
    } else {
      if (multiplier > 1) {
        combined[type] = multiplier;
      }
    }
  });

  Object.entries(secondaryRelation).forEach(([type, multiplier]) => {
    if (!(type in combined) && multiplier > 1) combined[type] = multiplier;
  });

  return combined;
}

function combineDamageRelations(damageRelations: z.infer<typeof damageRelationsResponsesSchema>) {
  const mainTypeDamageRelations = normalizeDamageRelations(damageRelations[0]);
  if (damageRelations.length === 1) return mainTypeDamageRelations;

  const secondaryTypeDamageRelations = normalizeDamageRelations(damageRelations[1]);

  return {
    to: combineOffensiveDamageRelations(
      mainTypeDamageRelations.to,
      secondaryTypeDamageRelations.to,
    ),
    from: combineDefensiveDamageRelations(
      mainTypeDamageRelations.from,
      secondaryTypeDamageRelations.from,
    ),
  };
}

const flavorTextEntriesSchema = z.array(
  z.object({
    flavor_text: z.string(),
    language: namedPokeAPIResourceSchema,
    version: namedPokeAPIResourceSchema,
  }),
);

function getEnglishFlavorTexts(entries: z.infer<typeof flavorTextEntriesSchema>) {
  return [
    ...new Set(
      entries.filter(({ language }) => language.name === 'en').map((text) => text.flavor_text),
    ),
  ];
}

function getPokemonImageById(id: string) {
  const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';
  return `${baseURL}/official-artwork/${id}.png`;
}

export interface NormalizedEvolution {
  from: {
    name: string;
    sprite: string;
  };
  to: {
    name: string;
    sprite: string;
  };
}

function extractPokemonIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\//);
  return match ? match[1] : '';
}

function normalizeEvolutionChain(evolutionChain: EvolutionChain): Array<NormalizedEvolution> {
  const { species, evolves_to } = evolutionChain;

  if (!evolves_to.length) return [];

  const evolutions = evolves_to.reduce<Array<NormalizedEvolution>>((chain, evolution) => {
    const fromId = extractPokemonIdFromUrl(species.url);
    const toId = extractPokemonIdFromUrl(evolution.species.url);

    return [
      ...chain,
      {
        from: {
          name: species.name,
          sprite: fromId ? getPokemonImageById(fromId) : '',
        },
        to: {
          name: evolution.species.name,
          sprite: toId ? getPokemonImageById(toId) : '',
        },
      },
      ...normalizeEvolutionChain(evolution),
    ];
  }, []);

  return evolutions;
}

const speciesSchema = z
  .object({
    shape: namedPokeAPIResourceSchema,
    base_happiness: z.number(),
    flavor_text_entries: flavorTextEntriesSchema,
    capture_rate: z.number(),
    habitat: namedPokeAPIResourceSchema.nullable(),
    evolution_chain: z.object({
      url: z.string().url(),
    }),
  })
  .transform(({ flavor_text_entries, capture_rate, habitat, base_happiness, ...rest }) => ({
    flavorTexts: getEnglishFlavorTexts(flavor_text_entries),
    captureRate: capture_rate,
    habitat: habitat?.name || null,
    baseHappiness: base_happiness,
    ...rest,
  }));

const baseEvolutionChainSchema = z.object({
  species: namedPokeAPIResourceSchema,
});

type EvolutionChain = z.infer<typeof baseEvolutionChainSchema> & {
  evolves_to: Array<EvolutionChain>;
};

const evolutionChainSchema: z.ZodType<EvolutionChain> = baseEvolutionChainSchema.extend({
  evolves_to: z.lazy(() => evolutionChainSchema.array()),
});

const evolutionChainDataSchema = z.object({
  chain: evolutionChainSchema,
});

const shapeDataSchema = z.object({
  awesome_names: z.array(
    z.object({
      awesome_name: z.string(),
      language: namedPokeAPIResourceSchema,
    }),
  ),
});

const damageRelationSchema = z.array(z.object({ name: z.string() }));

const damageRelationsSchema = z
  .object({
    damage_relations: z.object({
      double_damage_from: damageRelationSchema,
      double_damage_to: damageRelationSchema,
      half_damage_from: damageRelationSchema,
      half_damage_to: damageRelationSchema,
      no_damage_from: damageRelationSchema,
      no_damage_to: damageRelationSchema,
    }),
  })
  .transform(({ damage_relations }) => ({
    ...damage_relations,
  }));

type DamageRelations = z.infer<typeof damageRelationsSchema>;

const damageRelationsResponsesSchema = z.array(damageRelationsSchema);

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export function usePokemon(pokemon: string) {
  return useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: async () => {
      const [pokemonData, speciesData] = await Promise.all([
        await pokeAPI(`/pokemon/${pokemon}`),
        await pokeAPI(`/pokemon-species/${pokemon}`),
      ]);

      const parsedPokemonData = pokemonSchema.parse(pokemonData);
      const { evolution_chain, shape, ...parsedSpeciesData } = speciesSchema.parse(speciesData);

      const evolutionChainResponse = await fetch(evolution_chain.url);
      const { chain } = evolutionChainDataSchema.parse(await evolutionChainResponse.json());

      const shapeResponse = await fetch(shape.url);
      const { awesome_names } = shapeDataSchema.parse(await shapeResponse.json());

      const shapeName =
        awesome_names.find(({ language }) => language.name === 'en')?.awesome_name || shape.name;

      const damageRelationsResponses = await Promise.all(
        parsedPokemonData.types.map(async (type) => await pokeAPI(`/type/${type}`)),
      );

      const effectiveness = damageRelationsResponsesSchema.parse(damageRelationsResponses);

      return {
        ...parsedPokemonData,
        ...parsedSpeciesData,
        shape: shapeName,
        evolutionChain: normalizeEvolutionChain(chain),
        damageRelations: combineDamageRelations(effectiveness),
      };
    },
  });
}
