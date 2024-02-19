import { fetchSinglePokemon } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';

export function usePokemon(pokemon: string) {
  return useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: () => fetchSinglePokemon(pokemon),
  });
}
