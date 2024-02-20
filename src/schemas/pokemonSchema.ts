import { z } from 'zod';

export const pokemonSchema = z
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
    weight: z.number(),
    height: z.number(),
    stats: z.array(
      z.object({
        base_stat: z.number(),
        stat: z.object({
          name: z.string(),
        }),
      }),
    ),
  })
  .transform(({ sprites, types, stats, ...rest }) => ({
    types: types.map(({ type }) => type.name),
    sprite: sprites.other['official-artwork'].front_default,
    stats: stats.map((stat) => ({
      name: stat.stat.name,
      base: stat.base_stat,
    })),
    ...rest,
  }));
