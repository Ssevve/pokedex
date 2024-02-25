import clsx from 'clsx';
import styles from './Section.module.css';

interface SectionProps extends React.PropsWithChildren {
  title: string;
  className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={clsx(styles.section, className || '')}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
