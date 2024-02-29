import { MAX_POKEMON_STAT_VALUE } from '@/constants';
import { EvolutionChain, FlavorTextEntries, PokemonType } from '@/services/pokeAPI';
import {
  EffectivenessKey,
  EffectivenessKeyPrefix,
  EffectivenessKeySuffix,
  NormalizedEvolution,
  ParsedTypeEffectiveness,
  TypeEffectiveness,
} from './types';
import { EffectivenessResponse } from '@/services/pokeAPI/types';

export function convertStatValueToPercentage(value: number) {
  return ((value / MAX_POKEMON_STAT_VALUE) * 100).toFixed(1);
}

export function extractIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\//);
  return match ? match[1] : '';
}

export function getEnglishFlavorTexts(entries: FlavorTextEntries) {
  return [
    ...new Set(
      entries.filter(({ language }) => language.name === 'en').map((text) => text.flavor_text),
    ),
  ];
}

export function getPokemonImageById(id: string) {
  const baseURL =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
  return `${baseURL}/${id}.png`;
}

export function normalizeEvolutionChain(
  evolutionChain: EvolutionChain,
): Array<NormalizedEvolution> {
  const { species, evolves_to } = evolutionChain;

  if (!evolves_to.length) return [];

  const evolutions = evolves_to.reduce<Array<NormalizedEvolution>>((chain, evolution) => {
    const fromId = extractIdFromUrl(species.url);
    const toId = extractIdFromUrl(evolution.species.url);

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

const effectivenessMultipliers: Record<EffectivenessKeyPrefix, number> = {
  double: 2,
  half: 0.5,
  no: 0,
};

const effectivenessKeyMap = {
  from: 'defense',
  to: 'offense',
} as const;

function getEffectivenessKeyParts(effectivenessKey: EffectivenessKey) {
  const split = effectivenessKey.split('_');
  const prefix = split[0] as EffectivenessKeyPrefix;
  const suffix = split[split.length - 1] as EffectivenessKeySuffix;

  return [prefix, suffix] as const;
}

function parseTypeEffectiveness(typeEffectiveness: PokemonType) {
  const parsed: ParsedTypeEffectiveness = {
    offense: {},
    defense: {},
  };

  Object.entries(typeEffectiveness).forEach(([effectivenessKey, types]) => {
    types.forEach(({ name }) => {
      const [prefix, suffix] = getEffectivenessKeyParts(effectivenessKey as EffectivenessKey);
      const newKey = effectivenessKeyMap[suffix];
      parsed[newKey][name] = effectivenessMultipliers[prefix];
    });
  });

  return parsed;
}

function groupTypesByMultiplier(combinedTypeMultipliers: TypeEffectiveness) {
  const grouped: Record<number, Array<string>> = {};
  const newKeys = [...new Set(Object.values(combinedTypeMultipliers))];
  const types = Object.keys(combinedTypeMultipliers);

  newKeys.forEach((key) => {
    grouped[key] = types.filter((type) => combinedTypeMultipliers[type] === key);
  });

  return grouped;
}

function combineDefensiveEffectiveness(
  mainDefensiveEffectiveness: TypeEffectiveness,
  secondaryDefensiveEffectiveness: TypeEffectiveness,
) {
  const combined: TypeEffectiveness = {};

  Object.entries(mainDefensiveEffectiveness).forEach(([type, multiplier]) => {
    const secondaryMultiplier = secondaryDefensiveEffectiveness[type];
    const newMultiplier = multiplier * (secondaryMultiplier || 1);

    if (newMultiplier === 1) {
      if (type in combined) {
        delete combined[type];
      }
    } else {
      combined[type] = newMultiplier;
    }
  });

  Object.entries(secondaryDefensiveEffectiveness).forEach(([type, multiplier]) => {
    if (!(type in mainDefensiveEffectiveness)) {
      combined[type] = multiplier;
    }
  });

  return combined;
}

function combineOffensiveEffectiveness(
  mainOffensiveEffectiveness: TypeEffectiveness,
  secondaryOffensiveEffectiveness: TypeEffectiveness,
) {
  const combined: TypeEffectiveness = {};

  Object.entries(mainOffensiveEffectiveness).forEach(([type, multiplier]) => {
    const secondaryMultiplier = secondaryOffensiveEffectiveness[type];
    if (secondaryMultiplier >= 0) {
      combined[type] = secondaryMultiplier > multiplier ? secondaryMultiplier : multiplier;
    } else {
      if (multiplier > 1) {
        combined[type] = multiplier;
      }
    }
  });

  Object.entries(secondaryOffensiveEffectiveness).forEach(([type, multiplier]) => {
    if (!(type in combined) && multiplier > 1) combined[type] = multiplier;
  });

  return combined;
}

function transformTypeEffectiveness({ offense, defense }: ParsedTypeEffectiveness) {
  return {
    offense: groupTypesByMultiplier(offense),
    defense: groupTypesByMultiplier(defense),
  };
}

export function combineTypeEffectiveness(effectiveness: EffectivenessResponse) {
  const mainTypeEffectiveness = parseTypeEffectiveness(effectiveness[0]);
  if (effectiveness.length === 1) {
    return transformTypeEffectiveness(mainTypeEffectiveness);
  }

  const secondaryTypeEffectiveness = parseTypeEffectiveness(effectiveness[1]);

  const combinedOffense = combineOffensiveEffectiveness(
    mainTypeEffectiveness.offense,
    secondaryTypeEffectiveness.offense,
  );

  const combinedDefense = combineDefensiveEffectiveness(
    mainTypeEffectiveness.defense,
    secondaryTypeEffectiveness.defense,
  );

  return transformTypeEffectiveness({ offense: combinedOffense, defense: combinedDefense });
}
