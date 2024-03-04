import { Section } from '@/components/Section';
import { MAX_POKEMON_STAT_VALUE } from '@/constants';
import { MoveVerticalIcon, PercentCircleIcon, SmileIcon, WeightIcon } from 'lucide-react';
import { convertStatValueToPercentage } from '../../utils';
import { Characteristic } from './Characteristic';
import styles from './Characteristics.module.css';

function convertHectogramsToKilograms(hectograms: number) {
  return hectograms / 10;
}

function convertDecimetersToMeters(decimeters: number) {
  return decimeters / 10;
}

interface CharacteristicsProps {
  typeColor: string;
  weight: number;
  height: number;
  captureRate: number;
  habitat: string | null;
  shape: string;
  baseHappiness: number;
}

export function Characteristics({
  weight,
  height,
  captureRate,
  typeColor,
  baseHappiness,
}: CharacteristicsProps) {
  return (
    <Section title="Characteristics">
      <div className={styles.characteristics}>
        <Characteristic icon={WeightIcon} title="Weight" iconColor={typeColor}>
          {`${convertHectogramsToKilograms(weight)}kg`}
        </Characteristic>

        <Characteristic icon={MoveVerticalIcon} title="Height" iconColor={typeColor}>
          {`${convertDecimetersToMeters(height)}m`}
        </Characteristic>

        <Characteristic icon={PercentCircleIcon} title="Catch Rate" iconColor={typeColor}>
          {`${convertStatValueToPercentage(captureRate)}%`}
        </Characteristic>

        <Characteristic icon={SmileIcon} title="Happiness" iconColor={typeColor}>
          {baseHappiness} / {MAX_POKEMON_STAT_VALUE}
        </Characteristic>
      </div>
    </Section>
  );
}
