import { Gamepad2 } from 'lucide-react';
import { site, type Language } from '../data/site';
import { SectionHeading } from './Ornaments';

export function Games({ language }: { language: Language }) {
  return (
    <section className="section page-container" id="games" aria-labelledby="games-title">
      <div id="games-title"><SectionHeading>{site.games.title[language]}</SectionHeading></div>
      <p className="support-intro">{site.games.intro[language]}</p>
      <div className="games-grid">
        {site.games.items.map((game, index) => <article className="game-card" key={game.name}>
          <div className="game-art" role="img" aria-label={`${game.name} ${site.games.placeholderLabel[language]}`}>
            <span className="game-number">0{index + 1} / 04</span>
            <Gamepad2 aria-hidden="true" />
          </div>
          <div className="game-info"><h3>{game.name}</h3><p>{game.description[language]}</p><span className="placeholder-label">{site.games.placeholderLabel[language]}</span></div>
        </article>)}
      </div>
    </section>
  );
}
