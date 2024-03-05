import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import { ComponentProps } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ComponentProps<'button'> {
  label: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

export function Button({
  label,
  icon: Icon,
  variant = 'primary',
  onClick,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button onClick={onClick} className={clsx(styles.button, styles[variant], className)} {...rest}>
      {Icon && <Icon />}
      <span>{label}</span>
    </button>
  );
}
