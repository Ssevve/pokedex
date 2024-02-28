import { Section } from '@/components/Section';
import { POKEMON_TYPE_COLORS } from '@/constants';
import { PokemonStat } from '@/schemas';
import clsx from 'clsx';
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
  stats: Array<PokemonStat>;
  mainType: string;
}

export function BaseStats({ stats, mainType }: BaseStatsProps) {
  const [inViewRef, isInView] = useInView({
    triggerOnce: true,
  });

  return (
    <Section title="Base Stats" className={styles.baseStats}>
      <table className={styles.table}>
        <tbody>
          {stats.map((stat, i) => (
            <tr key={stat.name}>
              <th className={styles.statLabel}>{statDisplayNames[stat.name]}</th>
              <td>
                <div className={styles.statTrack}>
                  <div
                    ref={i === 0 ? inViewRef : null}
                    className={clsx(styles.statTrackFill, isInView && styles.animateGrowStat)}
                    style={{
                      '--bg-color': POKEMON_TYPE_COLORS[mainType],
                      maxWidth: isInView ? convertStatValueToPercentage(stat.value) + '%' : 0,
                    }}
                  />
                  <div className={styles.statTrackValue}>{stat.value}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
