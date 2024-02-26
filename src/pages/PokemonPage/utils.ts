import { MAX_POKEMON_STAT_VALUE } from '@/constants';
import {
  DamageRelations,
  DamageRelationsResponses,
  EvolutionChain,
  FlavorTextEntries,
} from './usePokemon';

export function convertStatValueToPercentage(value: number) {
  return ((value / MAX_POKEMON_STAT_VALUE) * 100).toFixed(1);
}

export function getEnglishFlavorTexts(entries: FlavorTextEntries) {
  return [
    ...new Set(
      entries.filter(({ language }) => language.name === 'en').map((text) => text.flavor_text),
    ),
  ];
}

function extractPokemonIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\//);
  return match ? match[1] : '';
}

export interface NormalizedEvolution {
  from: {
    name: string;
    sprite: string;
  };
  to: {
    name: string;
    sprite: string;
  };
}

export function normalizeEvolutionChain(
  evolutionChain: EvolutionChain,
): Array<NormalizedEvolution> {
  const { species, evolves_to } = evolutionChain;

  if (!evolves_to.length) return [];

  const evolutions = evolves_to.reduce<Array<NormalizedEvolution>>((chain, evolution) => {
    const fromId = extractPokemonIdFromUrl(species.url);
    const toId = extractPokemonIdFromUrl(evolution.species.url);

    return [
      ...chain,
      {
        from: {
          name: species.name,
          sprite: fromId ? getPokemonImageById(fromId) : '',
        },
        to: {
          name: evolution.species.name,
          sprite: toId ? getPokemonImageById(toId) : '',
        },
      },
      ...normalizeEvolutionChain(evolution),
    ];
  }, []);

  return evolutions;
}

export function getPokemonImageById(id: string) {
  const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';
  return `${baseURL}/official-artwork/${id}.png`;
}

type DamageRelationPrefix = 'double' | 'half' | 'no';
type DamageRelationSuffix = 'from' | 'to';
type DamageRelationKey = `${DamageRelationPrefix}_damage_${DamageRelationSuffix}`;
type TypeDamageRelation = Record<string, number>;

const relationMultipliers: Record<DamageRelationPrefix, number> = {
  double: 2,
  half: 0.5,
  no: 0,
};

function getRelationKeyParts(relationKey: DamageRelationKey) {
  const splitRelation = relationKey.split('_');
  const relationPrefix = splitRelation[0] as DamageRelationPrefix;
  const relationSuffix = splitRelation[splitRelation.length - 1] as DamageRelationSuffix;

  return [relationPrefix, relationSuffix] as const;
}

function transformDamageRelations(relations: DamageRelations) {
  const transformed: Record<DamageRelationSuffix, TypeDamageRelation> = {
    to: {},
    from: {},
  };

  Object.entries(relations).forEach(([relationKey, types]) => {
    types.forEach(({ name }) => {
      const [prefix, suffix] = getRelationKeyParts(relationKey as DamageRelationKey);
      transformed[suffix][name] = relationMultipliers[prefix];
    });
  });

  return transformed;
}

function groupTypesByMultiplier(combinedTypeMultipliers: TypeDamageRelation) {
  const grouped: Record<number, Array<string>> = {};
  const newKeys = [...new Set(Object.values(combinedTypeMultipliers))];
  const types = Object.keys(combinedTypeMultipliers);

  newKeys.forEach((key) => {
    grouped[key] = types.filter((type) => combinedTypeMultipliers[type] === key);
  });

  return grouped;
}

function combineDefensiveDamageRelations(
  mainRelation: TypeDamageRelation,
  secondaryRelation: TypeDamageRelation,
) {
  const combined: TypeDamageRelation = {};

  Object.entries(mainRelation).forEach(([type, multiplier]) => {
    const secondaryRelationMultiplier = secondaryRelation[type];
    const newMultiplier = multiplier * (secondaryRelationMultiplier || 1);

    if (newMultiplier === 1) {
      if (type in combined) {
        delete combined[type];
      }
    } else {
      combined[type] = newMultiplier;
    }
  });

  Object.entries(secondaryRelation).forEach(([type, multiplier]) => {
    if (!(type in mainRelation)) {
      combined[type] = multiplier;
    }
  });

  return groupTypesByMultiplier(combined);
}

function combineOffensiveDamageRelations(
  mainRelation: TypeDamageRelation,
  secondaryRelation: TypeDamageRelation,
) {
  const combined: TypeDamageRelation = {};

  Object.entries(mainRelation).forEach(([type, multiplier]) => {
    const secondaryRelationMultiplier = secondaryRelation[type];
    if (secondaryRelationMultiplier >= 0) {
      combined[type] =
        secondaryRelationMultiplier > multiplier ? secondaryRelationMultiplier : multiplier;
    } else {
      if (multiplier > 1) {
        combined[type] = multiplier;
      }
    }
  });

  Object.entries(secondaryRelation).forEach(([type, multiplier]) => {
    if (!(type in combined) && multiplier > 1) combined[type] = multiplier;
  });

  return groupTypesByMultiplier(combined);
}

export function combineDamageRelations(damageRelations: DamageRelationsResponses) {
  const mainTypeDamageRelations = transformDamageRelations(damageRelations[0]);
  if (damageRelations.length === 1)
    return {
      to: groupTypesByMultiplier(mainTypeDamageRelations.to),
      from: groupTypesByMultiplier(mainTypeDamageRelations.from),
    };

  const secondaryTypeDamageRelations = transformDamageRelations(damageRelations[1]);

  return {
    to: combineOffensiveDamageRelations(
      mainTypeDamageRelations.to,
      secondaryTypeDamageRelations.to,
    ),
    from: combineDefensiveDamageRelations(
      mainTypeDamageRelations.from,
      secondaryTypeDamageRelations.from,
    ),
  };
}
