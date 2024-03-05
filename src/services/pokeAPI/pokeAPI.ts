import { POKEMONS_PER_PAGE } from '@/constants';
import {
  abilitySchema,
  evolutionChainDataSchema,
  paginatedPokemonSchema,
  pokemonSchema,
  pokemonTypeSchema,
  speciesSchema,
} from './schemas';

const baseURL = 'https://pokeapi.co/api/v2';

const urls = {
  page: 'pokemon',
  pokemon: 'pokemon',
  species: 'pokemon-species',
  evolutionChain: 'evolution-chain',
  type: 'type',
  ability: 'ability',
} as const;

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

export async function getPaginatedPokemon(pageParam: number, perPage: number = POKEMONS_PER_PAGE) {
  const endpoint = `/${urls.page}?limit=${perPage}&offset=${pageParam}`;
  const res = await client(endpoint);
  return paginatedPokemonSchema.parse(res);
}

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export async function getPokemon(pokemon: string) {
  const endpoint = `/${urls.pokemon}/${pokemon}`;
  const res = await client(endpoint);
  return pokemonSchema.parse(res);
}

// `pokemon` param can be a Pokemon ID or a Pokemon name.
export async function getSpecies(pokemon: string) {
  const endpoint = `/${urls.species}/${pokemon}`;
  const res = await client(endpoint);
  return speciesSchema.parse(res);
}

export async function getEvolutionChainById(id: string) {
  const endpoint = `/${urls.evolutionChain}/${id}`;
  const res = await client(endpoint);
  return evolutionChainDataSchema.parse(res);
}

export async function getTypeByName(name: string) {
  const endpoint = `/${urls.type}/${name}`;
  const res = await client(endpoint);
  return pokemonTypeSchema.parse(res);
}

export async function getAbilityById(id: string) {
  const endpoint = `/${urls.ability}/${id}`;
  const res = await client(endpoint);
  return abilitySchema.parse(res);
}
