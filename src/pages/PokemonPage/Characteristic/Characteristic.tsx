import { LucideIcon } from 'lucide-react';
import styles from './Characteristic.module.css';

interface CharacteristicProps extends React.PropsWithChildren {
  icon: LucideIcon;
  title: string;
}

export function Characteristic({ icon: Icon, title, children }: CharacteristicProps) {
  return (
    <div className={styles.characteristic}>
      <Icon width={40} height={40} aria-hidden />
      <h3 className={styles.characteristicTitle}>{title}</h3>
      <span>{children}</span>
    </div>
  );
}
