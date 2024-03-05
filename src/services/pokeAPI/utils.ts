import { RawAbility } from './types';

export function getEnglishAbilityDescription(entries: RawAbility['effect_entries']) {
  return entries.find((entry) => entry.language.name === 'en')?.short_effect;
}
