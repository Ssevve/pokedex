import { Badge } from '@/components/Badge';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { padPokemonId } from '@/utils';
import styles from './PokemonCard.module.css';
import { Link } from 'react-router-dom';

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
      <Link className={styles.link} to={`/${id}`}>
        <img className={styles.sprite} src={sprite} alt={name} />
        <div className={styles.info}>
          <span>#{padPokemonId(id)}</span>
          <h2 className={styles.name}>{name}</h2>
          <div className={styles.types}>
            {types.map((type) => (
              <Badge key={type} backgroundColor={POKEMON_TYPE_COLORS[type]} text={type} />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
