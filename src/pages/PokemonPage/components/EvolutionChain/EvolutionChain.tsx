import { Section } from '@/components/Section';
import clsx from 'clsx';
import { MoveRightIcon } from 'lucide-react';
import { NormalizedEvolution } from '../../usePokemon';
import styles from './EvolutionChain.module.css';

interface EvolutionChainProps {
  evolutionChain: Array<NormalizedEvolution>;
}

export function EvolutionChain({ evolutionChain }: EvolutionChainProps) {
  return (
    <Section title="Evolution Chain" className={styles.evolutionChain}>
      {evolutionChain.length === 0 ? (
        <p>This Pokemon does not evolve!</p>
      ) : (
        evolutionChain.map((evolution) => (
          <div key={evolution.from.name + evolution.to.name} className={styles.wrapper}>
            <div className={styles.pokemon}>
              <div className={styles.spriteWrapper}>
                <div className={styles.pokeballBg} />
                <img src={evolution.from.sprite} alt={evolution.from.name} />
              </div>
              <span>{evolution.from.name}</span>
            </div>
            <MoveRightIcon className={styles.arrow} size={75} />
            <div className={clsx(styles.pokemon, styles.toPokemon)}>
              <div className={styles.spriteWrapper}>
                <div className={styles.pokeballBg} />
                <img src={evolution.to.sprite} alt={evolution.to.name} />
              </div>
              <span>{evolution.to.name}</span>
            </div>
          </div>
        ))
      )}
    </Section>
  );
}
