import { z } from 'zod';
import { pokeAPI } from './client';

function formatFlavorText(text: string) {
  // Makes flavor text suitable for HTML presentation
  // https://github.com/veekun/pokedex/issues/218#issuecomment-339841781

  return text
    .replace('\f', '\n')
    .replace('\u00ad\n', '')
    .replace('\u00ad', '')
    .replace(' -\n', ' - ')
    .replace('-\n', '-')
    .replace('\n', ' ');
}

function getRandomFlavorText(entries: FlavorTextEntries) {
  const englishFlavorTexts = entries.filter(({ language }) => language.name === 'en');

  const randomIndex = Math.floor(Math.random() * englishFlavorTexts.length);
  const randomFlavorText = englishFlavorTexts[randomIndex].flavor_text;

  return randomFlavorText ? formatFlavorText(randomFlavorText) : 'Flavor text not available.';
}

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

const flavorTextResponseSchema = z
  .object({
    flavor_text_entries: flavorTextEntriesSchema,
  })
  .transform(({ flavor_text_entries }) => getRandomFlavorText(flavor_text_entries));

// Name can also be a pokemon ID.
export async function fetchPokemonFlavorTextByName(name: string) {
  return flavorTextResponseSchema.parse(await pokeAPI(`/pokemon-species/${name}`));
}
