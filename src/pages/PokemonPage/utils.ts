import { MAX_POKEMON_STAT_VALUE } from '@/constants';

// Makes flavor text suitable for HTML presentation
// https://github.com/veekun/pokedex/issues/218#issuecomment-339841781
export function formatFlavorText(text: string) {
  return text
    .replace('\f', '\n')
    .replace('\u00ad\n', '')
    .replace('\u00ad', '')
    .replace(' -\n', ' - ')
    .replace('-\n', '-')
    .replace('\n', ' ');
}

export function capitalize(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

export function convertStatValueToPercentage(value: number) {
  return ((value / MAX_POKEMON_STAT_VALUE) * 100).toFixed(1);
}

export function convertHectogramsToKilograms(hectograms: number) {
  return hectograms / 10;
}

export function convertDecimetersToMeters(decimeters: number) {
  return decimeters / 10;
}

export function getRandomFlavorText(texts: Array<string>) {
  if (!texts.length) return 'Flavor text not available.';
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}
