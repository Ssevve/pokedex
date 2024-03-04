import { LucideIcon } from 'lucide-react';
import styles from './Characteristic.module.css';

interface CharacteristicProps extends React.PropsWithChildren {
  icon: LucideIcon;
  title: string;
  iconColor: string;
}

export function Characteristic({ icon: Icon, iconColor, title, children }: CharacteristicProps) {
  return (
    <div className={styles.characteristic} style={{ '--icon-color': iconColor }}>
      <Icon width={40} height={40} aria-hidden />
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.content}>{children}</span>
    </div>
  );
}
