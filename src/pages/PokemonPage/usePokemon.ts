import { namedPokeAPIResourceSchema, pokemonSchema } from '@/schemas';
import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { combineDamageRelations, getEnglishFlavorTexts, normalizeEvolutionChain } from './utils';

const flavorTextEntriesSchema = z.array(
  z.object({
    flavor_text: z.string(),
    language: namedPokeAPIResourceSchema,
    version: namedPokeAPIResourceSchema,
  }),
);

export type FlavorTextEntries = z.infer<typeof flavorTextEntriesSchema>;

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

export type EvolutionChain = z.infer<typeof baseEvolutionChainSchema> & {
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

export type DamageRelations = z.infer<typeof damageRelationsSchema>;

const damageRelationsResponsesSchema = z.array(damageRelationsSchema);
export type DamageRelationsResponses = z.infer<typeof damageRelationsResponsesSchema>;

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

      const damageRelations = damageRelationsResponsesSchema.parse(damageRelationsResponses);

      return {
        ...parsedPokemonData,
        ...parsedSpeciesData,
        shape: shapeName,
        evolutionChain: normalizeEvolutionChain(chain),
        effectiveness: combineDamageRelations(damageRelations),
      };
    },
  });
}
