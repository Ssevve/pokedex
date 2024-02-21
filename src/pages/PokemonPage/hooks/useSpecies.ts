import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// TODO: Extract named resource schema to a separate file

const flavorTextEntriesSchema = z.array(
  z.object({
    flavor_text: z.string(),
    language: z.object({
      name: z.string(),
    }),
    version: z.object({
      name: z.string(),
    }),
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
    shape: z.object({
      name: z.string(),
      url: z.string(),
    }),
    base_happiness: z.number(),
    flavor_text_entries: flavorTextEntriesSchema,
    capture_rate: z.number(),
    habitat: z
      .object({
        name: z.string(),
        url: z.string().url(),
      })
      .nullable(),
  })
  .transform(({ flavor_text_entries, capture_rate, habitat, base_happiness, shape }) => ({
    flavorTexts: getEnglishFlavorTexts(flavor_text_entries),
    captureRate: capture_rate,
    habitat: habitat?.name || null,
    baseHappiness: base_happiness,
    shape: shape.name,
  }));

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export function useSpecies(pokemon: string) {
  return useQuery({
    queryKey: ['species', pokemon],
    queryFn: async () => speciesSchema.parse(await pokeAPI(`/pokemon-species/${pokemon}`)),
  });
}
