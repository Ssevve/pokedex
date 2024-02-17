import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

const POKEMON_PER_PAGE = 20;

const pokemonsPageSchema = z.object({
  next: z.string().url().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
    }),
  ),
});

const pokemonSchema = z
  .object({
    name: z.string(),
    sprites: z.object({
      other: z.object({
        'official-artwork': z.object({
          front_default: z.string().url(),
        }),
      }),
    }),
    id: z.number(),
    types: z.array(
      z.object({
        type: z.object({
          name: z.string(),
        }),
      }),
    ),
  })
  .transform(({ sprites, types, ...rest }) => ({
    types: types.map(({ type }) => type.name),
    sprite: sprites.other['official-artwork'].front_default,
    ...rest,
  }));

export type Pokemon = z.infer<typeof pokemonSchema>;

async function fetchPokemons({ pageParam = 0 }) {
  const pokemonPageResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${pageParam}`,
  );

  if (!pokemonPageResponse.ok) {
    throw Error('Failed to fetch pokemons page.');
  }

  const pokemonsPageData = pokemonsPageSchema.parse(await pokemonPageResponse.json());

  const detailedPokemons = await Promise.all(
    pokemonsPageData.results.map(async ({ url, name }) => {
      const detailsResponse = await fetch(url);

      if (!detailsResponse.ok) {
        throw Error(`Failed to fetch detailed data for pokemon: ${name}.`);
      }

      return pokemonSchema.parse(await detailsResponse.json());
    }),
  );

  return {
    next: pokemonsPageData.next,
    results: detailedPokemons,
  };
}

export function usePokemons() {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['pokemon'],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.next ? allPages.length * POKEMON_PER_PAGE : undefined;
    },
  });
}
