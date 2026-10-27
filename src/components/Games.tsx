import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { site, type Language } from '../data/site';
import { useSteamGames } from '../hooks/useSteamGames';
import { SectionHeading } from './Ornaments';

function GameArt({
  name,
  headerImage,
  placeholderLabel,
  index,
}: {
  name: string;
  headerImage: string | null;
  placeholderLabel: string;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(headerImage) && !imageFailed;

  return (
    <div
      className="game-art"
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : `${name} ${placeholderLabel}`}
    >
      {showImage && headerImage
        ? <img
          className="game-art-image"
          src={headerImage}
          alt={name}
          onError={() => setImageFailed(true)}
        />
        : <Gamepad2 aria-hidden="true" />}
      <span className="game-number">0{index + 1} / 04</span>
    </div>
  );
}

export function Games({ language }: { language: Language }) {
  const { games } = useSteamGames();
  const hasApiData = Array.isArray(games) && games.length > 0;
  const gameItems = hasApiData
    ? games.map((game) => ({
      key: game.appid,
      name: game.name,
      description: game.short_description,
      headerImage: game.header_image,
      storeUrl: game.store_url,
    }))
    : site.games.items.map((game, index) => ({
      key: `fallback-${index}`,
      name: game.name,
      description: game.description[language],
      headerImage: null,
      storeUrl: null,
    }));

  return (
    <section className="section page-container" id="games" aria-labelledby="games-title">
      <div id="games-title"><SectionHeading>{site.games.title[language]}</SectionHeading></div>
      <p className="support-intro">{site.games.intro[language]}</p>
      <div className="games-grid">
        {gameItems.map((game, index) => <article className="game-card" key={game.key}>
          <GameArt
            name={game.name}
            headerImage={game.headerImage}
            placeholderLabel={site.games.placeholderLabel[language]}
            index={index}
          />
          <div className="game-info">
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            {game.storeUrl
              ? <a className="placeholder-label" href={game.storeUrl} target="_blank" rel="noreferrer">
                {language === 'pt' ? 'Ver na Steam' : 'View on Steam'}
              </a>
              : <span className="placeholder-label">{site.games.placeholderLabel[language]}</span>}
          </div>
        </article>)}
      </div>
    </section>
  );
}
