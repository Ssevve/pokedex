import { POKEMON_TYPE_COLORS } from '@/constants';
import clsx from 'clsx';
import styles from './PokemonTypes.module.css';

interface PokemonTypesProps {
  types: Array<string>;
  className?: string;
}

export function PokemonTypes({ types, className }: PokemonTypesProps) {
  return (
    <ul className={clsx(styles.types, className || '')}>
      {types.map((type) => (
        <li key={type} style={{ '--bg-color': POKEMON_TYPE_COLORS[type] }}>
          {type}
        </li>
      ))}
    </ul>
  );
}
