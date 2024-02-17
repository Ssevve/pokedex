import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './HomePage.module.css';
import { PokeballLoader, PokemonCard } from './components';
import { usePokemons } from './hooks';

export function HomePage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = usePokemons();
  const [inViewRef, isInView] = useInView();

  const pokemonList = data?.pages.flatMap((page) => page.results) || [];

  const isLoadingPokemons = isLoading || isFetchingNextPage;

  useEffect(() => {
    if (isInView) fetchNextPage();
  }, [isInView, fetchNextPage]);

  return (
    <main className={styles.container}>
      <ul className={styles.list}>
        {pokemonList.map(({ name, types, sprite, id }, i) => {
          const isLastPokemon = i === pokemonList.length - 1;

          return (
            <li key={id} ref={isLastPokemon ? inViewRef : null}>
              <PokemonCard name={name} types={types} sprite={sprite} id={id} />
            </li>
          );
        })}
      </ul>
      {isLoadingPokemons && <PokeballLoader />}
    </main>
  );
}
