import pokeballImage from '@/assets/pokeball.png';
import styles from './PokeballLoader.module.css';

export function PokeballLoader() {
  return (
    <div className={styles.wrapper} role="status">
      <img className={styles.pokeball} src={pokeballImage} aria-hidden />
      <p className={styles.text}>Loading pokemons...</p>
    </div>
  );
}
