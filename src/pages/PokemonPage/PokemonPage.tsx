import { PokeballLoader } from '@/components/PokeballLoader';
import { padPokemonId } from '@/utils';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import styles from './PokemonPage.module.css';
import { usePokemon } from './hooks/usePokemon';
import { useSpecies } from './hooks/useSpecies';

// Makes flavor text suitable for HTML presentation
// https://github.com/veekun/pokedex/issues/218#issuecomment-339841781
function formatFlavorText(text: string) {
  return text
    .replace('\f', '\n')
    .replace('\u00ad\n', '')
    .replace('\u00ad', '')
    .replace(' -\n', ' - ')
    .replace('-\n', '-')
    .replace('\n', ' ');
}

function getRandomFlavorText(texts: Array<string>) {
  if (!texts.length) return 'Flavor text not available.';
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const getPokemon = usePokemon(pokemon);
  const getSpecies = useSpecies(pokemon);

  const flavorTexts = getSpecies.data?.flavorTexts || [];

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
          <p className={styles.flavorText}>{formatFlavorText(getRandomFlavorText(flavorTexts))}</p>
        </header>
      </main>
    );
  }

  if (getPokemon.isError) return <div>Oops!</div>;

  return <PokeballLoader />;
}
