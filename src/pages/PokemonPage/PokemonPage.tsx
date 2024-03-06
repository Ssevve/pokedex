import { ErrorFallback } from '@/components/ErrorFallback';
import { Main } from '@/components/Main';
import { PokeballLoader } from '@/components/PokeballLoader';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { useParams } from 'react-router-dom';
import styles from './PokemonPage.module.css';
import { Abilities } from './components/Abilities';
import { BaseStats } from './components/BaseStats';
import { Characteristics } from './components/Characteristics';
import { Effectiveness } from './components/Effectiveness';
import { EvolutionChain } from './components/EvolutionChain';
import { Header } from './components/Header';
import { useDetailedPokemon } from './useDetailedPokemon';

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const { data, isError, refetch } = useDetailedPokemon(pokemon.toLowerCase());

  if (isError) return <ErrorFallback refetch={refetch} />;

  if (!data)
    return (
      <Main className={styles.loaderWrapper}>
        <PokeballLoader />
      </Main>
    );

  const {
    sprite,
    types,
    name,
    id,
    weight,
    height,
    habitat,
    captureRate,
    baseHappiness,
    shape,
    flavorTexts,
    stats,
    evolutionChain,
    effectiveness,
    abilities,
    isLegendary,
    isMythical,
  } = data;

  const mainType = types[0];
  const mainTypeColor = POKEMON_TYPE_COLORS[mainType];

  return (
    <Main>
      <Header
        isLegendary={isLegendary}
        isMythical={isMythical}
        id={id}
        name={name}
        sprite={sprite}
        types={types}
        flavorTexts={flavorTexts}
        typeColor={mainTypeColor}
      />
      <Characteristics
        baseHappiness={baseHappiness}
        captureRate={captureRate}
        habitat={habitat}
        height={height}
        typeColor={mainTypeColor}
        shape={shape}
        weight={weight}
      />
      <Effectiveness effectiveness={effectiveness} />
      <div className={styles.doubleSectionWrapper}>
        <BaseStats stats={stats} typeColor={mainTypeColor} />
        <Abilities abilities={abilities} />
      </div>
      <EvolutionChain evolutionChain={evolutionChain} />
    </Main>
  );
}
