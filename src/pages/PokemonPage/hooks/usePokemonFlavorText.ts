import { fetchPokemonFlavorText } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';

export function usePokemonFlavorText(pokemon: string) {
  return useQuery({
    queryKey: ['pokemon-flavor-text', pokemon],
    queryFn: () => fetchPokemonFlavorText(pokemon),
  });
}
