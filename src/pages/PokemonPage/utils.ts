import { MAX_POKEMON_STAT_VALUE } from '@/constants';

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
