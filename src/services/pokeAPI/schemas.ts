import { z } from 'zod';
import { EvolutionChain } from './types';

export const namedPokeAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const pokemonPageSchema = z.object({
  next: z.string().url().nullable(),
  results: z.array(namedPokeAPIResourceSchema),
});

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
        type: namedPokeAPIResourceSchema,
      }),
    ),
    weight: z.number(),
    height: z.number(),
    stats: z.array(
      z.object({
        base_stat: z.number(),
        stat: namedPokeAPIResourceSchema,
      }),
    ),
  })
  .transform(({ sprites, types, stats, ...rest }) => ({
    types: types.map(({ type }) => type.name),
    sprite: sprites.other['official-artwork'].front_default,
    stats: stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
    ...rest,
  }));

export const flavorTextEntriesSchema = z.array(
  z.object({
    flavor_text: z.string(),
    language: namedPokeAPIResourceSchema,
    version: namedPokeAPIResourceSchema,
  }),
);

export const speciesSchema = z
  .object({
    shape: namedPokeAPIResourceSchema,
    base_happiness: z.number(),
    flavor_text_entries: flavorTextEntriesSchema,
    capture_rate: z.number(),
    habitat: namedPokeAPIResourceSchema.nullable(),
    evolution_chain: z.object({
      url: z.string().url(),
    }),
  })
  .transform(({ flavor_text_entries, capture_rate, habitat, base_happiness, ...rest }) => ({
    flavorTexts: flavor_text_entries,
    captureRate: capture_rate,
    habitat: habitat?.name || null,
    baseHappiness: base_happiness,
    ...rest,
  }));

export const baseEvolutionChainSchema = z.object({
  species: namedPokeAPIResourceSchema,
});

const evolutionChainSchema: z.ZodType<EvolutionChain> = baseEvolutionChainSchema.extend({
  evolves_to: z.lazy(() => evolutionChainSchema.array()),
});

export const evolutionChainDataSchema = z.object({
  chain: evolutionChainSchema,
});

const damageRelationSchema = z.array(z.object({ name: z.string() }));

export const pokemonTypeSchema = z
  .object({
    damage_relations: z.object({
      double_damage_from: damageRelationSchema,
      double_damage_to: damageRelationSchema,
      half_damage_from: damageRelationSchema,
      half_damage_to: damageRelationSchema,
      no_damage_from: damageRelationSchema,
      no_damage_to: damageRelationSchema,
    }),
  })
  .transform(({ damage_relations }) => ({
    ...damage_relations,
  }));

export const effectivenessSchema = z.array(pokemonTypeSchema);
