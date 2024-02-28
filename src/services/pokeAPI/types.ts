import { z } from 'zod';
import {
  baseEvolutionChainSchema,
  effectivenessSchema,
  flavorTextEntriesSchema,
  pokemonSchema,
  pokemonTypeSchema,
} from './schemas';

export type Stat = z.infer<typeof pokemonSchema>['stats'][0];
export type FlavorTextEntries = z.infer<typeof flavorTextEntriesSchema>;
export type EvolutionChain = z.infer<typeof baseEvolutionChainSchema> & {
  evolves_to: Array<EvolutionChain>;
};
export type PokemonType = z.infer<typeof pokemonTypeSchema>;
export type Effectiveness = z.infer<typeof effectivenessSchema>;
