import { POKEMONS_PER_PAGE } from '@/constants';
import { z } from 'zod';
import { pokeAPI } from './client';
import { fetchSinglePokemon } from '.';

const pokemonsPageSchema = z.object({
  next: z.string().url().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
    }),
  ),
});

export async function fetchPokemons({ pageParam = 0 }) {
  const pokemonsResponse = await pokeAPI(`/pokemon?limit=${POKEMONS_PER_PAGE}&offset=${pageParam}`);

  const pokemonsPage = pokemonsPageSchema.parse(pokemonsResponse);

  const pokemons = await Promise.all(
    pokemonsPage.results.map(async ({ name }) => {
      return fetchSinglePokemon(name);
    }),
  );

  return {
    next: pokemonsPage.next,
    results: pokemons,
  };
}
