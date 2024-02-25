import clsx from 'clsx';
import styles from './Main.module.css';

interface MainProps extends React.PropsWithChildren {
  className?: string;
}

export function Main({ className, children }: MainProps) {
  return <main className={clsx(styles.main, className || '')}>{children}</main>;
}
