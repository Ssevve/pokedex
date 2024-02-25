import { MAX_POKEMON_STAT_VALUE } from '@/constants';

export function convertStatValueToPercentage(value: number) {
  return ((value / MAX_POKEMON_STAT_VALUE) * 100).toFixed(1);
}
