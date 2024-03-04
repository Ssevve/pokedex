import { Section } from '@/components/Section';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { Stat } from '@/services/pokeAPI';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { convertStatValueToPercentage } from '../../utils';
import styles from './BaseStats.module.css';
import { forwardRef } from 'react';

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
  mainType: string;
}

export function BaseStats({ stats, mainType }: BaseStatsProps) {
  const [inViewRef, isInView] = useInView({
    triggerOnce: true,
  });

  const statColor = POKEMON_TYPE_COLORS[mainType];

  return (
    <Section title="Base Stats">
      <table className={styles.table}>
        <tbody>
          {stats.map(({ name, value }, i) => (
            <Stat
              fillColor={statColor}
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

const Stat = forwardRef<HTMLDivElement, StatProps>(
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
