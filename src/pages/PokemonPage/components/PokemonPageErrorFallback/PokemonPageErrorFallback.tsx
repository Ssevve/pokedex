import { Button } from '@/components/Button';
import { Main } from '@/components/Main';
import { HomeIcon, RefreshCcwIcon } from 'lucide-react';
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
          <Link to="/">
            <Button icon={HomeIcon} label="Home page" />
          </Link>
          <Button icon={RefreshCcwIcon} label="Try again" variant="secondary" onClick={refetch} />
        </div>
      </div>
    </Main>
  );
}
