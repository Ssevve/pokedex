import { Section } from '@/components/Section';
import { PokemonEffectiveness } from '../../types';
import { Badge } from '@/components/Badge';
import styles from './Effectiveness.module.css';
import { POKEMON_TYPE_COLORS } from '@/constants';
import clsx from 'clsx';

function sortByMultiplierDescending(entries: Array<[string, Array<string>]>) {
  return entries.sort(([multiplierA], [multiplierB]) => Number(multiplierB) - Number(multiplierA));
}

interface EffectivenessProps {
  effectiveness: PokemonEffectiveness;
  type: string;
}

// TODO: Refactor
export function Effectiveness({ effectiveness, type }: EffectivenessProps) {
  const offenseEntries = sortByMultiplierDescending(Object.entries(effectiveness.offense));
  const defenseEntries = sortByMultiplierDescending(Object.entries(effectiveness.defense));

  return (
    <Section className={styles.section} title="Effectiveness">
      <div className={styles.wrapper}>
        <div
          className={clsx(styles.multipliersWrapper, styles.offense)}
          style={{ color: POKEMON_TYPE_COLORS[type] }}
        >
          {offenseEntries.map(([multiplier, types]) => {
            return (
              <div key={`offense-${multiplier}`} className={styles.multiplierSection}>
                <h3>Deals {multiplier}x to:</h3>
                <div className={styles.types}>
                  {types.map((type) => (
                    <Badge
                      key={type}
                      text={type}
                      fontSize={12}
                      backgroundColor={POKEMON_TYPE_COLORS[type]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={clsx(styles.multipliersWrapper, styles.defense)}
          style={{ color: POKEMON_TYPE_COLORS[type] }}
        >
          {defenseEntries.map(([multiplier, types]) => {
            return (
              <div key={`defense-${multiplier}`} className={styles.multiplierSection}>
                <h3>Takes {multiplier}x from:</h3>
                <div className={styles.types}>
                  {types.map((type) => (
                    <Badge
                      key={type}
                      text={type}
                      fontSize={12}
                      backgroundColor={POKEMON_TYPE_COLORS[type]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
