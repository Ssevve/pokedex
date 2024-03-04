import { Section } from '@/components/Section';
import { AbilityWithIsHidden } from '../../types';

interface AbilitiesProps {
  abilities: Array<AbilityWithIsHidden>;
}

export function Abilities({ abilities }: AbilitiesProps) {
  return (
    <Section title="Abilities">
      {abilities.map(({ description, isHidden, name }) => (
        <div key={name}>
          <h3>
            {name} {isHidden ? '(hidden)' : null}
          </h3>
          <p>{description}</p>
        </div>
      ))}
    </Section>
  );
}
