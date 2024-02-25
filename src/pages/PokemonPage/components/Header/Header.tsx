import { padPokemonId } from '@/utils';
import clsx from 'clsx';
import styles from './Header.module.css';

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

interface HeaderProps {
  types: Array<string>;
  sprite: string;
  name: string;
  id: number;
  flavorTexts: Array<string>;
}

export function Header({ types, sprite, name, id, flavorTexts }: HeaderProps) {
  const mainType = types[0];
  return (
    <header className={styles.header}>
      <div className={styles.baseInfo}>
        <div className={styles.spriteWrapper}>
          <div className={clsx(styles.spriteBackground, `bg-${mainType}-transparent`)} />
          <img className={styles.sprite} src={sprite} alt={name} />
        </div>
        <div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
            <span className={styles.id}>#{padPokemonId(id)}</span>
          </div>
          <ul className={styles.types}>
            {types.map((type) => (
              <li key={type} className={`bg-${type}`}>
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Flavor text</h2>
        <p className={styles.flavorText}>{formatFlavorText(getRandomFlavorText(flavorTexts))}</p>
      </section>
    </header>
  );
}