import { fetchPokemonSpecies } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';

export function usePokemonSpecies(pokemon: string) {
  return useQuery({
    queryKey: ['pokemon-species', pokemon],
    queryFn: () => fetchPokemonSpecies(pokemon),
  });
}
