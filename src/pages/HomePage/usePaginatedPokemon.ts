import { POKEMONS_PER_PAGE } from '@/constants';
import * as pokeAPI from '@/services/pokeAPI/pokeAPI';
import { useInfiniteQuery } from '@tanstack/react-query';

export function usePaginatedPokemon() {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['pokemons'],
    queryFn: async ({ pageParam = 0 }) => {
      const paginatedPokemon = await pokeAPI.getPaginatedPokemon(pageParam);

      const pokemons = await Promise.all(
        paginatedPokemon.results.map(({ name }) => {
          return pokeAPI.getPokemon(name);
        }),
      );

      return {
        next: paginatedPokemon.next,
        results: pokemons,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.next ? allPages.length * POKEMONS_PER_PAGE : undefined;
    },
  });
}
