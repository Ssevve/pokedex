import pokeballImage from '@/assets/pokeball.png';
import styles from './PokeballLoader.module.css';

export function PokeballLoader() {
  return (
    <div className={styles.wrapper}>
      <img className={styles.pokeball} src={pokeballImage} alt="loading" />
      <p className={styles.text}>Loading pokemons...</p>
    </div>
  );
}
