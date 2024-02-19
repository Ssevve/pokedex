import { z } from 'zod';
import { pokeAPI } from './client';

const pokemonSpeciesSchema = z.object({
  weight: z.number(),
  height: z.number(),
});

// Pokemon param can be a Pokemon ID or a Pokemon name.
export async function fetchPokemonSpecies(pokemon: string) {
  return pokemonSpeciesSchema.parse(await pokeAPI(`/pokemon-species/${pokemon}`));
}
