import { fetchPokemonFlavorTextByName } from '@/services/pokeAPI/fetchPokemonFlavorTextByName';
import { useQuery } from '@tanstack/react-query';

export function usePokemonFlavorText(name: string) {
  return useQuery({
    queryKey: ['pokemon-flavor-text', name],
    queryFn: () => fetchPokemonFlavorTextByName(name),
  });
}
