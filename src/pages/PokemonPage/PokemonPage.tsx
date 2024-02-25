import { PokeballLoader } from '@/components/PokeballLoader';
import { MAX_POKEMON_STAT_VALUE } from '@/constants';
import clsx from 'clsx';
import {
  HomeIcon,
  MoveVerticalIcon,
  PercentCircleIcon,
  ShapesIcon,
  SmileIcon,
  WeightIcon,
  MoveRightIcon,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';
import { Characteristic } from './Characteristics/Characteristic';
import styles from './PokemonPage.module.css';
import { usePokemon } from './usePokemon';
import {
  capitalize,
  convertDecimetersToMeters,
  convertHectogramsToKilograms,
  convertStatValueToPercentage,
} from './utils';
import { Header } from './components/Header/Header';

type PokemonPageParams = {
  pokemon: string;
};

const statDisplayNames: Record<string, string> = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'sp. atk',
  'special-defense': 'sp. def',
  speed: 'spd',
};

export function PokemonPage() {
  const { pokemon } = useParams() as PokemonPageParams;
  const { data, isError } = usePokemon(pokemon);
  const [inViewRef, isInView] = useInView({
    triggerOnce: true,
  });

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
      stats,
      evolutionChain,
    } = data;

    const mainType = types[0];

    return (
      <main className={styles.container}>
        <Header id={id} name={name} sprite={sprite} types={types} flavorTexts={flavorTexts} />
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Characteristics</h2>
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

            <Characteristic icon={HomeIcon} title="Habitat" type={mainType}>
              {habitat ? capitalize(habitat) : 'N/A'}
            </Characteristic>

            <Characteristic icon={SmileIcon} title="Happiness" type={mainType}>
              {baseHappiness} / {MAX_POKEMON_STAT_VALUE}
            </Characteristic>

            <Characteristic icon={ShapesIcon} title="Shape" type={mainType}>
              {capitalize(shape)}
            </Characteristic>
          </div>
        </section>
        <section className={clsx(styles.section, styles.statsSection)}>
          <h2 className={styles.sectionHeading}>Base Stats</h2>
          <table ref={inViewRef} className={styles.table}>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.name}>
                  <th className={styles.statLabel}>{statDisplayNames[stat.name]}</th>
                  <td>
                    <div className={styles.statTrack}>
                      <div
                        className={clsx(
                          styles.statTrackFill,
                          `bg-${mainType}`,
                          isInView && styles.animateGrow,
                        )}
                        style={{ maxWidth: convertStatValueToPercentage(stat.value) + '%' }}
                      />
                      <div className={styles.statTrackValue}>{stat.value}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className={clsx(styles.section, styles.evolutionsSection)}>
          <h2 className={styles.sectionHeading}>Evolution Chain</h2>
          {evolutionChain.length === 0 ? (
            <p>This Pokemon does not evolve!</p>
          ) : (
            evolutionChain.map((evolution) => (
              <div className={styles.evolutionWrapper}>
                <div className={styles.evolutionPokemon}>
                  <div className={styles.evolutionPokemonSpriteWrapper}>
                    <div className={styles.pokeballBg} />
                    <img src={evolution.from.sprite} alt={evolution.from.name} />
                  </div>
                  <span>{evolution.from.name}</span>
                </div>
                <MoveRightIcon className={styles.evolutionArrow} size={75} />
                <div className={clsx(styles.evolutionPokemon, styles.evolutionPokemonTo)}>
                  <div className={styles.evolutionPokemonSpriteWrapper}>
                    <div className={styles.pokeballBg} />
                    <img
                      className={styles.evolutionImage}
                      src={evolution.to.sprite}
                      alt={evolution.to.name}
                    />
                  </div>
                  <span>{evolution.to.name}</span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    );
  }

  if (isError) return <div>Oops!</div>;

  return (
    <div className={clsx(styles.container, styles.loaderWrapper)}>
      <PokeballLoader />
    </div>
  );
}
