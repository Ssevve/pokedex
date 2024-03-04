import { Section } from '@/components/Section';
import { AbilityWithIsHidden } from '../../types';
import styles from './Abilities.module.css';

interface AbilitiesProps {
  abilities: Array<AbilityWithIsHidden>;
}

export function Abilities({ abilities }: AbilitiesProps) {
  return (
    <Section className={styles.wrapper} title="Abilities">
      <div className={styles.wrapper}>
        {abilities.map(({ description, isHidden, name }) => (
          <Ability description={description} isHidden={isHidden} name={name} />
        ))}
      </div>
    </Section>
  );
}

interface AbilityProps {
  name: string;
  isHidden: boolean;
  description: string;
}

function Ability({ name, isHidden, description }: AbilityProps) {
  return (
    <div key={name}>
      <h2 className={styles.name}>
        {name}
        <span className={styles.hidden}>{isHidden && '(hidden)'}</span>
      </h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
