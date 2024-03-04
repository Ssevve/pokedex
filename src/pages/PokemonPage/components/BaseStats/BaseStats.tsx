import { Section } from '@/components/Section';
import { Stat } from '@/services/pokeAPI';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { convertStatValueToPercentage } from '../../utils';
import styles from './BaseStats.module.css';

const statDisplayNames: Record<string, string> = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'sp. atk',
  'special-defense': 'sp. def',
  speed: 'spd',
};

interface BaseStatsProps {
  stats: Array<Stat>;
  typeColor: string;
}

export function BaseStats({ stats, typeColor }: BaseStatsProps) {
  const [inViewRef, isInView] = useInView({
    triggerOnce: true,
  });

  return (
    <Section title="Base Stats">
      <table className={styles.table}>
        <tbody>
          {stats.map(({ name, value }, i) => (
            <StatMeter
              fillColor={typeColor}
              name={statDisplayNames[name]}
              value={value}
              isInView={isInView}
              ref={i === 0 ? inViewRef : null}
            />
          ))}
        </tbody>
      </table>
    </Section>
  );
}

interface StatProps {
  name: string;
  value: number;
  isInView: boolean;
  fillColor: string;
}

const StatMeter = forwardRef<HTMLDivElement, StatProps>(
  ({ name, value, isInView, fillColor }, inViewRef) => {
    return (
      <tr key={name}>
        <th className={styles.statLabel}>{name}</th>
        <td>
          <div className={styles.statTrack}>
            <div
              ref={inViewRef}
              className={clsx(styles.statTrackFill, isInView && styles.animateGrowStat)}
              style={{
                '--bg-color': fillColor,
                maxWidth: isInView ? convertStatValueToPercentage(value) + '%' : 0,
              }}
            />
            <div className={styles.statTrackValue}>{value}</div>
          </div>
        </td>
      </tr>
    );
  },
);
