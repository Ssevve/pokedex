import { useParams } from 'react-router-dom';
import { usePokemon } from './hooks/usePokemon';
import { PokeballLoader } from '../HomePage/components';
import styles from './PokemonPage.module.css';
import { usePokemonFlavorText } from './hooks/usePokemonFlavorText';
import { padPokemonId } from '@/utils';
import clsx from 'clsx';

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const getPokemon = usePokemon(pokemon);
  const getPokemonFlavorText = usePokemonFlavorText(pokemon);

  if (getPokemon.data) {
    const { sprite, types, name, id } = getPokemon.data;
    const mainType = types[0];
    return (
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.spriteWrapper}>
            <div className={clsx(styles.spriteBackground, `bg-${mainType}-transparent`)} />
            <img className={styles.sprite} src={sprite} alt={name} />
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
            <span className={styles.index}>#{padPokemonId(id)}</span>
          </div>
          <ul className={styles.types}>
            {types.map((type) => (
              <li key={type} className={`bg-${type}`}>
                {type}
              </li>
            ))}
          </ul>
          <p className={styles.flavorText}>{getPokemonFlavorText.data}</p>
        </header>
      </main>
    );
  }

  if (getPokemon.isError) return <div>Oops!</div>;

  return <PokeballLoader />;
}
