import { POKEMONS_PER_PAGE } from '@/constants';
import * as pokeAPI from '@/services/pokeAPI/pokeAPI';
import { useInfiniteQuery } from '@tanstack/react-query';

export function usePokemonPage() {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['pokemons'],
    queryFn: async ({ pageParam = 0 }) => {
      const pokemonPage = await pokeAPI.getPokemonPage(pageParam);

      const pokemons = await Promise.all(
        pokemonPage.results.map(({ name }) => {
          return pokeAPI.getPokemon(name);
        }),
      );

      return {
        next: pokemonPage.next,
        results: pokemons,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.next ? allPages.length * POKEMONS_PER_PAGE : undefined;
    },
  });
}
