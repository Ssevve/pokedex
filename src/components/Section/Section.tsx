import clsx from 'clsx';
import styles from './Section.module.css';
import { ComponentProps } from 'react';

interface SectionProps extends ComponentProps<'section'> {
  title: string;
  className?: string;
}

export function Section({ title, className = '', children, ...rest }: SectionProps) {
  return (
    <section className={clsx(styles.section, className)} {...rest}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
