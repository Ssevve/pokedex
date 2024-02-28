import { POKEMON_TYPE_COLORS } from '@/constants';
import { LucideIcon } from 'lucide-react';
import { CSSProperties } from 'react';
import styles from './Characteristic.module.css';

interface CharacteristicProps extends React.PropsWithChildren {
  icon: LucideIcon;
  title: string;
  type: string;
}

export function Characteristic({ icon: Icon, type, title, children }: CharacteristicProps) {
  return (
    <div
      className={styles.characteristic}
      style={{ '--icon-color': POKEMON_TYPE_COLORS[type] } as CSSProperties}
    >
      <Icon width={40} height={40} aria-hidden />
      <h3>{title}</h3>
      <span>{children}</span>
    </div>
  );
}
