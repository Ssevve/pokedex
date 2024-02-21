import { POKEMONS_PER_PAGE } from '@/constants';
import { pokemonSchema } from '@/schemas';
import { pokeAPI } from '@/services/pokeAPI';
import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

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
      return pokemonSchema.parse(await pokeAPI(`/pokemon/${name}`));
    }),
  );

  return {
    next: pokemonsPage.next,
    results: pokemons,
  };
}

export function usePokemons() {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.next ? allPages.length * POKEMONS_PER_PAGE : undefined;
    },
  });
}
