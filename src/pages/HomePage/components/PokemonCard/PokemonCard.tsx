import { padPokemonId } from '@/utils';
import styles from './PokemonCard.module.css';
import clsx from 'clsx';

interface PokemonCardProps {
  name: string;
  sprite: string;
  types: Array<string>;
  id: number;
}

export function PokemonCard({ name, sprite, types, id }: PokemonCardProps) {
  const mainType = types[0];
  return (
    <div className={clsx(styles.card, `bg-${mainType}-transparent`)}>
      <img className={styles.sprite} src={sprite} alt={name} />
      <div className={styles.info}>
        <span>#{padPokemonId(id)}</span>
        <h2 className={styles.name}>{name}</h2>
        <ul className={styles.types}>
          {types.map((type) => (
            <li key={type} className={`bg-${type}`}>
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
