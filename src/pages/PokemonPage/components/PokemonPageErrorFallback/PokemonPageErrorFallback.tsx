import { Main } from '@/components/Main';
import clsx from 'clsx';
import { MoveLeftIcon, RefreshCcwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './PokemonPageErrorFallback.module.css';

interface PokemonPageErrorFallbackProps {
  refetch: () => void;
}

export function PokemonPageErrorFallback({ refetch }: PokemonPageErrorFallbackProps) {
  return (
    <Main>
      <div className={styles.wrapper}>
        <h1>Oh no!</h1>
        <p>Something went wrong!</p>
        <div className={styles.actions}>
          <Link to="/" className={clsx(styles.button, styles.homeLink)}>
            <MoveLeftIcon />
            <span>Home page</span>
          </Link>
          <button onClick={refetch} className={clsx(styles.button, styles.retryButton)}>
            <RefreshCcwIcon />
            <span>Try again</span>
          </button>
        </div>
      </div>
    </Main>
  );
}
