import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

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
  console.log(entries);
  return entries.filter(({ language }) => language.name === 'en').map((text) => text.flavor_text);
}

const speciesSchema = z
  .object({
    flavor_text_entries: flavorTextEntriesSchema,
  })
  .transform(({ flavor_text_entries, ...rest }) => ({
    flavorTexts: getEnglishFlavorTexts(flavor_text_entries),
    ...rest,
  }));

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export function useSpecies(pokemon: string) {
  return useQuery({
    queryKey: ['species', pokemon],
    queryFn: async () => speciesSchema.parse(await pokeAPI(`/pokemon-species/${pokemon}`)),
  });
}
