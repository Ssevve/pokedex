import { ComponentProps } from 'react';
import styles from './Badge.module.css';

interface BadgeProps extends ComponentProps<'div'> {
  text: string;
  backgroundColor?: string;
  fontSize?: number;
}

export function Badge({ text, fontSize = 16, backgroundColor = 'gray', ...rest }: BadgeProps) {
  return (
    <div
      className={styles.badge}
      style={{
        '--bg-color': backgroundColor,
        fontSize,
        paddingBlock: fontSize / 4,
        paddingInline: fontSize,
      }}
      {...rest}
    >
      {text}
    </div>
  );
}
