import { POKEMONS_PER_PAGE } from '@/constants';
import {
  evolutionChainDataSchema,
  pokemonPageSchema,
  pokemonSchema,
  pokemonTypeSchema,
  speciesSchema,
} from './schemas';

const baseURL = 'https://pokeapi.co/api/v2';

export const client = async (endpoint: string) => {
  const res = await fetch(baseURL + endpoint);

  if (!res.ok) {
    return Promise.reject({
      status: res.status,
      message: res.statusText,
    });
  }

  return res.json();
};

export async function getPokemonPage(pageParam: number, perPage: number = POKEMONS_PER_PAGE) {
  return pokemonPageSchema.parse(await client(`/pokemon?limit=${perPage}&offset=${pageParam}`));
}

export async function getPokemon(pokemon: string) {
  return pokemonSchema.parse(await client(`/pokemon/${pokemon}`));
}

export async function getSpecies(pokemon: string) {
  return speciesSchema.parse(await client(`/pokemon-species/${pokemon}`));
}

export async function getEvolutionChainById(id: string) {
  return evolutionChainDataSchema.parse(await client(`/evolution-chain/${id}`));
}

export async function getTypeByName(name: string) {
  return pokemonTypeSchema.parse(await client(`/type/${name}`));
}
