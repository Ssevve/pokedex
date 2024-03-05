import { Main } from '@/components/Main';
import clsx from 'clsx';
import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import styles from './ErrorFallback.module.css';

export function ErrorFallback() {
  return (
    <Main>
      <div className={styles.wrapper}>
        <h1>Oh no!</h1>
        <p>Something went wrong!</p>
        <Link to="/" className={clsx(styles.button, styles.homeLink)}>
          <Button icon={HomeIcon} label="Home page" />
        </Link>
      </div>
    </Main>
  );
}
