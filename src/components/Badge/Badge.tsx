import styles from './Badge.module.css';

interface BadgeProps {
  text: string;
  backgroundColor?: string;
  fontSize?: number;
}

export function Badge({ text, fontSize = 16, backgroundColor = 'gray' }: BadgeProps) {
  return (
    <div
      className={styles.badge}
      style={{
        '--bg-color': backgroundColor,
        fontSize,
        paddingBlock: fontSize / 2,
        paddingInline: fontSize,
      }}
    >
      {text}
    </div>
  );
}
