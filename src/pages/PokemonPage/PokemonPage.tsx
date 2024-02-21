import { PokeballLoader } from '@/components/PokeballLoader';
import { padPokemonId } from '@/utils';
import clsx from 'clsx';
import {
  HomeIcon,
  MoveVerticalIcon,
  PercentCircleIcon,
  WeightIcon,
  SmileIcon,
  ShapesIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import styles from './PokemonPage.module.css';
import { usePokemon } from './hooks/usePokemon';
import { useSpecies } from './hooks/useSpecies';
import { Characteristic } from './Characteristic';

function capitalize(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

function convertCaptureRateToPercentage(captureRate: number) {
  const MAX_CAPTURE_RATE = 255;
  return ((captureRate / MAX_CAPTURE_RATE) * 100).toFixed(1);
}

function convertHectogramsToKilograms(hectograms: number) {
  return hectograms / 10;
}

function convertDecimetersToMeters(decimeters: number) {
  return decimeters / 10;
}

// Makes flavor text suitable for HTML presentation
// https://github.com/veekun/pokedex/issues/218#issuecomment-339841781
function formatFlavorText(text: string) {
  return text
    .replace('\f', '\n')
    .replace('\u00ad\n', '')
    .replace('\u00ad', '')
    .replace(' -\n', ' - ')
    .replace('-\n', '-')
    .replace('\n', ' ');
}

function getRandomFlavorText(texts: Array<string>) {
  if (!texts.length) return 'Flavor text not available.';
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

type PokemonPageParams = {
  pokemon: string;
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const getPokemon = usePokemon(pokemon);
  const getSpecies = useSpecies(pokemon);

  const flavorTexts = getSpecies.data?.flavorTexts || [];

  const isSuccess = getPokemon.isSuccess && getSpecies.isSuccess;

  if (isSuccess) {
    const { sprite, types, name, id, weight, height } = getPokemon.data;
    const mainType = types[0];

    const { habitat, captureRate, baseHappiness, shape } = getSpecies.data;

    return (
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.spriteWrapper}>
            <div className={clsx(styles.spriteBackground, `bg-${mainType}-transparent`)} />
            <img className={styles.sprite} src={sprite} alt={name} />
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
            <span className={styles.index}>#{padPokemonId(id)}</span>
          </div>
          <ul className={styles.types}>
            {types.map((type) => (
              <li key={type} className={`bg-${type}`}>
                {type}
              </li>
            ))}
          </ul>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Flavor text</h2>
            <p className={styles.flavorText}>
              {formatFlavorText(getRandomFlavorText(flavorTexts))}
            </p>
          </section>
        </header>
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Characteristics</h2>
          {/* TODO: Breakpoints and columns for characteristics */}
          <div className={styles.characteristics}>
            <Characteristic icon={WeightIcon} title="Weight">
              {`${convertHectogramsToKilograms(weight)}kg`}
            </Characteristic>

            <Characteristic icon={MoveVerticalIcon} title="Height">
              {`${convertDecimetersToMeters(height)}m`}
            </Characteristic>

            <Characteristic icon={PercentCircleIcon} title="Capture">
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

  if (getPokemon.isError) return <div>Oops!</div>;

  return <PokeballLoader />;
}
