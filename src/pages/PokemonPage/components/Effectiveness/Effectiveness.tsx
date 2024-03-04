import { Badge } from '@/components/Badge';
import { Section } from '@/components/Section';
import { POKEMON_TYPE_COLORS } from '@/constants';
import clsx from 'clsx';
import { PokemonEffectiveness } from '../../types';
import styles from './Effectiveness.module.css';

function sortByMultiplierDescending(entries: Array<[string, Array<string>]>) {
  return entries.sort(([multiplierA], [multiplierB]) => Number(multiplierB) - Number(multiplierA));
}

interface EffectivenessProps {
  effectiveness: PokemonEffectiveness;
}

export function Effectiveness({ effectiveness }: EffectivenessProps) {
  const offenseEntries = sortByMultiplierDescending(Object.entries(effectiveness.offense));
  const defenseEntries = sortByMultiplierDescending(Object.entries(effectiveness.defense));

  return (
    <Section title="Effectiveness">
      <div className={styles.sides}>
        <section className={clsx(styles.sideWrapper, styles.offense)}>
          {offenseEntries.map(([multiplier, types]) => {
            return (
              <div key={`offense-${multiplier}`} className={styles.multiplierWrapper}>
                <h2 className={styles.multiplierTitle}>Deals {multiplier}x to:</h2>
                <div className={styles.types}>
                  <TypeBadges types={types} />
                </div>
              </div>
            );
          })}
        </section>

        <section className={clsx(styles.sideWrapper, styles.defense)}>
          {defenseEntries.map(([multiplier, types]) => {
            return (
              <div key={`defense-${multiplier}`} className={styles.multiplierWrapper}>
                <h2 className={styles.multiplierTitle}>Takes {multiplier}x from:</h2>
                <div className={styles.types}>
                  <TypeBadges types={types} />
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </Section>
  );
}

interface TypeBadgesProps {
  types: Array<string>;
}

function TypeBadges({ types }: TypeBadgesProps) {
  return types.map((type) => (
    <Badge
      className={styles.badge}
      key={type}
      text={type}
      fontSize={12}
      backgroundColor={POKEMON_TYPE_COLORS[type]}
    />
  ));
}
