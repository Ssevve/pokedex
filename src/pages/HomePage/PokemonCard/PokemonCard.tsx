import { PokemonTypes } from '@/components/PokemonTypes';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { padPokemonId } from '@/utils';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  name: string;
  sprite: string;
  types: Array<string>;
  id: number;
}

export function PokemonCard({ name, sprite, types, id }: PokemonCardProps) {
  const mainType = types[0];
  return (
    <div className={styles.card} style={{ '--bg-color': POKEMON_TYPE_COLORS[mainType] }}>
      <img className={styles.sprite} src={sprite} alt={name} />
      <div className={styles.info}>
        <span>#{padPokemonId(id)}</span>
        <h2 className={styles.name}>{name}</h2>
        <PokemonTypes types={types} />
      </div>
    </div>
  );
}
