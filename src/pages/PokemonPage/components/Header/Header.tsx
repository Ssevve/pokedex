import { PokemonTypes } from '@/components/PokemonTypes';
import { Section } from '@/components/Section';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { padPokemonId } from '@/utils';
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
  mainType: string;
}

export function Header({ types, sprite, name, id, flavorTexts, mainType }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.baseInfo}>
        <div className={styles.spriteWrapper}>
          <div
            className={styles.spriteBackground}
            style={{ '--bg-color': POKEMON_TYPE_COLORS[mainType] }}
          />
          <img className={styles.sprite} src={sprite} alt={name} />
        </div>
        <div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
            <span className={styles.id}>#{padPokemonId(id)}</span>
          </div>
          <PokemonTypes className={styles.types} types={types} />
        </div>
      </div>
      <Section title="Flavor text">
        <p className={styles.flavorText}>{formatFlavorText(getRandomFlavorText(flavorTexts))}</p>
      </Section>
    </header>
  );
}
