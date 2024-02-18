import { POKEMONS_PER_PAGE } from '@/constants';
import { fetchPokemons } from '@/services/pokeAPI';
import { useInfiniteQuery } from '@tanstack/react-query';

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
