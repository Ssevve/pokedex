import { namedPokeAPIResourceSchema, pokemonSchema } from '@/schemas';
import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

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

      return {
        ...parsedPokemonData,
        ...parsedSpeciesData,
        shape: shapeName,
        evolutionChain: normalizeEvolutionChain(chain),
      };
    },
  });
}
