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
          <h2>
            {name} {isHidden ? '(hidden)' : null}
          </h2>
          <p>{description}</p>
        </div>
      ))}
    </Section>
  );
}
