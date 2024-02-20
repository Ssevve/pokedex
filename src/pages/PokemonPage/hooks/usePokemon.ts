import { pokemonSchema } from '@/schemas/pokemonSchema';
import { pokeAPI } from '@/services/pokeAPI';
import { useQuery } from '@tanstack/react-query';

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export function usePokemon(pokemon: string) {
  return useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: async () => pokemonSchema.parse(await pokeAPI(`/pokemon/${pokemon}`)),
  });
}
