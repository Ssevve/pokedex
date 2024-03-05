import { z } from 'zod';
import { EvolutionChain } from './types';
import { getEnglishAbilityDescription } from './utils';

export const namedPokeAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const paginatedPokemonSchema = z.object({
  next: z.string().url().nullable(),
  results: z.array(namedPokeAPIResourceSchema),
});

export const rawPokemonSchema = z.object({
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
  abilities: z.array(
    z.object({
      ability: namedPokeAPIResourceSchema,
      is_hidden: z.boolean(),
    }),
  ),
});

export const pokemonSchema = rawPokemonSchema.transform(({ sprites, types, stats, ...rest }) => ({
  types: types.map(({ type }) => type.name),
  sprite: sprites.other['official-artwork'].front_default,
  stats: stats.map((stat) => ({
    name: stat.stat.name,
    value: stat.base_stat,
  })),
  ...rest,
}));

export const flavorTextEntrySchema = z.object({
  flavor_text: z.string(),
  language: namedPokeAPIResourceSchema,
  version: namedPokeAPIResourceSchema,
});

const rawSpeciesSchema = z.object({
  shape: namedPokeAPIResourceSchema,
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  base_happiness: z.number(),
  flavor_text_entries: z.array(flavorTextEntrySchema),
  capture_rate: z.number(),
  habitat: namedPokeAPIResourceSchema.nullable(),
  evolution_chain: z.object({
    url: z.string().url(),
  }),
});

export const speciesSchema = rawSpeciesSchema.transform(
  ({
    flavor_text_entries,
    capture_rate,
    habitat,
    base_happiness,
    is_legendary,
    is_mythical,
    ...rest
  }) => ({
    flavorTexts: flavor_text_entries,
    captureRate: capture_rate,
    habitat: habitat?.name || null,
    baseHappiness: base_happiness,
    isLegendary: is_legendary,
    isMythical: is_mythical,
    ...rest,
  }),
);

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

const rawPokemonTypeSchema = z.object({
  damage_relations: z.object({
    double_damage_from: damageRelationSchema,
    double_damage_to: damageRelationSchema,
    half_damage_from: damageRelationSchema,
    half_damage_to: damageRelationSchema,
    no_damage_from: damageRelationSchema,
    no_damage_to: damageRelationSchema,
  }),
});

export const pokemonTypeSchema = rawPokemonTypeSchema.transform(({ damage_relations }) => ({
  ...damage_relations,
}));

export const effectivenessResponseSchema = z.array(pokemonTypeSchema);

export const rawAbilitySchema = z.object({
  name: z.string(),
  effect_entries: z.array(
    z.object({
      short_effect: z.string(),
      language: namedPokeAPIResourceSchema,
    }),
  ),
});

export const abilitySchema = rawAbilitySchema.transform(({ name, effect_entries }) => ({
  name,
  description: getEnglishAbilityDescription(effect_entries) || 'Ability description not available',
}));
