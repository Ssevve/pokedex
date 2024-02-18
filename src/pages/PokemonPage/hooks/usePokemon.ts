import { fetchPokemonByName } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';

export function usePokemon(name: string) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonByName(name),
  });
}
