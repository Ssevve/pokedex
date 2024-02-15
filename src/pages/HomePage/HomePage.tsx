import { usePokemons } from '@/hooks/usePokemons';
import { PokemonCard } from './components/PokemonCard';
import styles from './HomePage.module.css';

export function HomePage() {
  const { data, isSuccess, fetchNextPage } = usePokemons();

  const pokemonList = data?.pages.flatMap((page) => page.results) || [];

  return (
    <main>
      {/* <h1>HomePage</h1> */}
      <ul className={styles.pokemonList}>
        {pokemonList.map(({ name, types, sprite, id }) => (
          <li key={id}>
            <PokemonCard name={name} types={types} sprite={sprite} id={id} />
          </li>
        ))}
      </ul>
      {/* <button onClick={() => fetchNextPage()}>Fetch next</button> */}
    </main>
  );
}
