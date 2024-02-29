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
  mainType: string;
  weight: number;
  height: number;
  captureRate: number;
  habitat: string | null;
  shape: string;
  baseHappiness: number;
}

export function Characteristics({
  mainType,
  weight,
  height,
  captureRate,
  baseHappiness,
}: CharacteristicsProps) {
  return (
    <Section title="Characteristics">
      <div className={styles.characteristics}>
        <Characteristic icon={WeightIcon} title="Weight" type={mainType}>
          {`${convertHectogramsToKilograms(weight)}kg`}
        </Characteristic>

        <Characteristic icon={MoveVerticalIcon} title="Height" type={mainType}>
          {`${convertDecimetersToMeters(height)}m`}
        </Characteristic>

        <Characteristic icon={PercentCircleIcon} title="Catch Rate" type={mainType}>
          {`${convertStatValueToPercentage(captureRate)}%`}
        </Characteristic>

        <Characteristic icon={SmileIcon} title="Happiness" type={mainType}>
          {baseHappiness} / {MAX_POKEMON_STAT_VALUE}
        </Characteristic>
      </div>
    </Section>
  );
}
