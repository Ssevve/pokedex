import * as pokeAPI from '@/services/pokeAPI/pokeAPI';
import { useQuery } from '@tanstack/react-query';
import {
  combineTypeEffectiveness,
  getIdFromUrl,
  getEnglishFlavorTexts,
  normalizeEvolutionChain,
  populateAbilityIsHidden,
} from './utils';

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export function useDetailedPokemon(pokemon: string) {
  return useQuery({
    queryKey: ['detailed-pokemon', pokemon],
    queryFn: async () => {
      const [pokemonData, speciesData] = await Promise.all([
        pokeAPI.getPokemon(pokemon),
        pokeAPI.getSpecies(pokemon),
      ]);
      const { evolution_chain, shape, flavorTexts, ...restSpeciesData } = speciesData;

      const evolutionChainId = getIdFromUrl(evolution_chain.url);
      const { chain } = await pokeAPI.getEvolutionChainById(evolutionChainId);

      const typeResponses = await Promise.all(
        pokemonData.types.map(async (type) => await pokeAPI.getTypeByName(type)),
      );

      const abilityResponses = await Promise.all(
        pokemonData.abilities.map(async ({ ability: { url } }) => {
          const id = getIdFromUrl(url);
          return await pokeAPI.getAbilityById(id);
        }),
      );

      const abilitiesWithIsHidden = abilityResponses.map((ability, index) => {
        return populateAbilityIsHidden(ability, pokemonData.abilities[index].is_hidden);
      });

      return {
        ...pokemonData,
        ...restSpeciesData,
        flavorTexts: getEnglishFlavorTexts(flavorTexts),
        shape: shape.name,
        evolutionChain: normalizeEvolutionChain(chain),
        effectiveness: combineTypeEffectiveness(typeResponses),
        abilities: abilitiesWithIsHidden,
      };
    },
  });
}
