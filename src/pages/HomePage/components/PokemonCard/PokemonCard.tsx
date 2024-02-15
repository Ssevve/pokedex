import styles from './PokemonCard.module.css';
import clsx from 'clsx';

interface PokemonCardProps {
  name: string;
  sprite: string;
  types: Array<string>;
  id: number;
}

function padId(id: number) {
  return id.toString().padStart(3, '0');
}

export function PokemonCard({ name, sprite, types, id }: PokemonCardProps) {
  const mainType = types[0];
  return (
    <div className={clsx(styles.card, styles[mainType])}>
      <img className={styles.sprite} src={sprite} alt={name} />
      <div className={styles.info}>
        <span>#{padId(id)}</span>
        <h2 className={styles.name}>{name}</h2>
        <ul className={styles.types}>
          {types.map((type) => (
            <li key={type} className={type}>
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
