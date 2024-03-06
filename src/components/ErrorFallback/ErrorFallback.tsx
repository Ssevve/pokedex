import { Button } from '@/components/Button';
import { Main } from '@/components/Main';
import { HomeIcon, RefreshCcwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  refetch?: () => void;
}

export function ErrorFallback({ refetch }: ErrorFallbackProps) {
  return (
    <Main>
      <div className={styles.wrapper}>
        <h1>Oh no!</h1>
        <p>Something went wrong!</p>
        <div className={styles.actions}>
          <Link to="/">
            <Button icon={HomeIcon} label="Home page" />
          </Link>
          {refetch && (
            <Button icon={RefreshCcwIcon} label="Try again" variant="secondary" onClick={refetch} />
          )}
        </div>
      </div>
    </Main>
  );
}
