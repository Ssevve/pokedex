import { Main } from '@/components/Main';
import { PokeballLoader } from '@/components/PokeballLoader';
import { useParams } from 'react-router-dom';
import styles from './PokemonPage.module.css';
import { BaseStats } from './components/BaseStats';
import { Characteristics } from './components/Characteristics';
import { EvolutionChain } from './components/EvolutionChain';
import { Header } from './components/Header';
import { usePokemon } from './usePokemon';
// import { Effectiveness } from './components/Effectiveness';

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const { data, isError } = usePokemon(pokemon.toLowerCase());

  if (data) {
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
        <div>
          <BaseStats stats={stats} mainType={mainType} />
          {/* <Effectiveness types={types} /> */}
        </div>
        <EvolutionChain evolutionChain={evolutionChain} />
      </Main>
    );
  }

  if (isError) return <div>Oops!</div>;

  return (
    <Main className={styles.loaderWrapper}>
      <PokeballLoader />
    </Main>
  );
}
