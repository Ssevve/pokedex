import { LucideIcon } from 'lucide-react';
import styles from './Characteristic.module.css';
import clsx from 'clsx';

interface CharacteristicProps extends React.PropsWithChildren {
  icon: LucideIcon;
  title: string;
  type: string;
}

export function Characteristic({ icon: Icon, type, title, children }: CharacteristicProps) {
  return (
    <div className={clsx(styles.characteristic, `text-${type}`)}>
      <Icon width={40} height={40} aria-hidden />
      <h3>{title}</h3>
      <span>{children}</span>
    </div>
  );
}
