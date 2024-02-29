import { combineTypeEffectiveness } from './utils';

interface NormalizedEvolutionPokemon {
  name: string;
  sprite: string;
}

export interface NormalizedEvolution {
  from: NormalizedEvolutionPokemon;
  to: NormalizedEvolutionPokemon;
}

export type EffectivenessKeyPrefix = 'double' | 'half' | 'no';
export type EffectivenessKeySuffix = 'from' | 'to';
export type EffectivenessKey = `${EffectivenessKeyPrefix}_damage_${EffectivenessKeySuffix}`;
export type TypeEffectiveness = Record<string, number>;
export type ParsedTypeEffectiveness = Record<'offense' | 'defense', TypeEffectiveness>;
export type PokemonEffectiveness = ReturnType<typeof combineTypeEffectiveness>;
