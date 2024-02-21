import { PokeballLoader } from '@/components/PokeballLoader';
import { padPokemonId } from '@/utils';
import clsx from 'clsx';
import {
  HomeIcon,
  MoveVerticalIcon,
  PercentCircleIcon,
  ShapesIcon,
  SmileIcon,
  WeightIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Characteristic } from './Characteristic';
import styles from './PokemonPage.module.css';
import { usePokemon } from './usePokemon';
import {
  capitalize,
  convertCaptureRateToPercentage,
  convertDecimetersToMeters,
  convertHectogramsToKilograms,
  formatFlavorText,
  getRandomFlavorText,
} from './utils';

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const { data, isError } = usePokemon(pokemon);

  if (data) {
    const {
      sprite,
      types,
      name,
      id,
      weight,
      height,
      habitat,
      captureRate,
      baseHappiness,
      shape,
      flavorTexts,
    } = data;

    const mainType = types[0];

    return (
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.baseInfo}>
            <div className={styles.spriteWrapper}>
              <div className={clsx(styles.spriteBackground, `bg-${mainType}-transparent`)} />
              <img className={styles.sprite} src={sprite} alt={name} />
            </div>
            <div>
              <div className={styles.nameWrapper}>
                <h1 className={styles.name}>{name}</h1>
                <span className={styles.id}>#{padPokemonId(id)}</span>
              </div>
              <ul className={styles.types}>
                {types.map((type) => (
                  <li key={type} className={`bg-${type}`}>
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <section className={clsx(styles.section, styles.flavorTextWrapper)}>
            <h2 className={styles.sectionHeading}>Flavor text</h2>
            <p className={styles.flavorText}>
              {formatFlavorText(getRandomFlavorText(flavorTexts))}
            </p>
          </section>
        </header>
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Characteristics</h2>
          <div className={styles.characteristics}>
            <Characteristic icon={WeightIcon} title="Weight">
              {`${convertHectogramsToKilograms(weight)}kg`}
            </Characteristic>

            <Characteristic icon={MoveVerticalIcon} title="Height">
              {`${convertDecimetersToMeters(height)}m`}
            </Characteristic>

            <Characteristic icon={PercentCircleIcon} title="Catch Rate">
              {`${convertCaptureRateToPercentage(captureRate)}%`}
            </Characteristic>

            <Characteristic icon={HomeIcon} title="Habitat">
              {habitat ? capitalize(habitat) : 'N/A'}
            </Characteristic>

            <Characteristic icon={SmileIcon} title="Happiness">
              {baseHappiness}
            </Characteristic>

            <Characteristic icon={ShapesIcon} title="Shape">
              {capitalize(shape)}
            </Characteristic>
          </div>
        </section>
      </main>
    );
  }

  if (isError) return <div>Oops!</div>;

  return <PokeballLoader />;
}
