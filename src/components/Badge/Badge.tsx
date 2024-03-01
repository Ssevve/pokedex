import { ComponentProps } from 'react';
import styles from './Badge.module.css';
import clsx from 'clsx';

interface BadgeProps extends ComponentProps<'div'> {
  text: string;
  backgroundColor?: string;
  fontSize?: number;
  className?: string;
}

export function Badge({
  text,
  fontSize = 16,
  backgroundColor = 'gray',
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <div
      className={clsx(styles.badge, className)}
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
