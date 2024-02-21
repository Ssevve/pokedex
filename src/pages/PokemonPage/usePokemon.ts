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

type FlavorTextEntries = z.infer<typeof flavorTextEntriesSchema>;

function getEnglishFlavorTexts(entries: FlavorTextEntries) {
  return [
    ...new Set(
      entries.filter(({ language }) => language.name === 'en').map((text) => text.flavor_text),
    ),
  ];
}

const speciesSchema = z
  .object({
    shape: namedPokeAPIResourceSchema,
    base_happiness: z.number(),
    flavor_text_entries: flavorTextEntriesSchema,
    capture_rate: z.number(),
    habitat: namedPokeAPIResourceSchema.nullable(),
  })
  .transform(({ flavor_text_entries, capture_rate, habitat, base_happiness, shape }) => ({
    flavorTexts: getEnglishFlavorTexts(flavor_text_entries),
    captureRate: capture_rate,
    habitat: habitat?.name || null,
    baseHappiness: base_happiness,
    shape: shape.name,
  }));

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
      const parsedSpeciesData = speciesSchema.parse(speciesData);

      return {
        ...parsedPokemonData,
        ...parsedSpeciesData,
      };
    },
  });
}
