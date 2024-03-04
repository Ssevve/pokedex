import { z } from 'zod';
import {
  abilitySchema,
  baseEvolutionChainSchema,
  effectivenessResponseSchema,
  flavorTextEntrySchema,
  pokemonSchema,
  pokemonTypeSchema,
  rawAbilitySchema,
} from './schemas';

export type Stat = z.infer<typeof pokemonSchema>['stats'][0];
export type FlavorTextEntry = z.infer<typeof flavorTextEntrySchema>;
export type EvolutionChain = z.infer<typeof baseEvolutionChainSchema> & {
  evolves_to: Array<EvolutionChain>;
};
export type PokemonType = z.infer<typeof pokemonTypeSchema>;
export type EffectivenessResponse = z.infer<typeof effectivenessResponseSchema>;
export type RawAbility = z.infer<typeof rawAbilitySchema>;
export type Ability = z.infer<typeof abilitySchema>;
