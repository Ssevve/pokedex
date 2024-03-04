import { Main } from '@/components/Main';
import { PokeballLoader } from '@/components/PokeballLoader';
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
  const { data, isError } = useDetailedPokemon(pokemon.toLowerCase());

  if (!data)
    return (
      <Main className={styles.loaderWrapper}>
        <PokeballLoader />
      </Main>
    );

  if (isError) return <div>Oops!</div>;

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
  } = data;

  const mainType = types[0];

  return (
    <Main>
      <Header
        id={id}
        name={name}
        sprite={sprite}
        types={types}
        flavorTexts={flavorTexts}
        mainType={mainType}
      />
      <Characteristics
        baseHappiness={baseHappiness}
        captureRate={captureRate}
        habitat={habitat}
        height={height}
        mainType={mainType}
        shape={shape}
        weight={weight}
      />
      <Effectiveness effectiveness={effectiveness} />
      <div className={styles.doubleSectionWrapper}>
        <BaseStats stats={stats} mainType={mainType} />
        <Abilities abilities={abilities} />
      </div>
      <EvolutionChain evolutionChain={evolutionChain} />
    </Main>
  );
}
