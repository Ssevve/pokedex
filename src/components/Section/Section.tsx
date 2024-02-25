import styles from './Section.module.css';

interface SectionProps extends React.PropsWithChildren {
  title: string;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
