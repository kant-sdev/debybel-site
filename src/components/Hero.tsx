import { ArrowUpRight, Twitch } from 'lucide-react';
import { site, type Language } from '../data/site';
import { LiveBadge } from './LiveBadge';

export function Hero({ language }: { language: Language }) {
  const playerUrl = (() => {
    const player = new URL('https://player.twitch.tv/');
    const parents = typeof window === 'undefined'
      ? ['localhost']
      : [...new Set([window.location.hostname || 'localhost', 'localhost'])];

    player.searchParams.set('channel', site.twitchChannel);
    parents.forEach((parent) => player.searchParams.append('parent', parent));
    player.searchParams.set('muted', 'true');
    return player.toString();
  })();
  return (
    <section className="hero page-container" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">{site.hero.eyebrow[language]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <h1 className="hero-title" id="hero-title">{site.name}</h1>
            <LiveBadge language={language} />
          </div>
          <p className="hero-line">{site.hero.line[language]}</p>
          <div className="hero-actions">
            <a className="twitch-cta" href={site.twitchUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.hero.twitchCta[language]} (${site.accessibility.opensNewTab[language]})`} data-testid="link-twitch-hero">
              <Twitch size={18} aria-hidden="true" />{site.hero.twitchCta[language]}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <span className="hero-aside-note">{site.hero.tabHint[language]}</span>
          </div>
        </div>
        <div className="player-card">
          <div className="player-head"><span>{site.hero.playerLabel[language]}</span><LiveBadge language={language} /></div>
          <div className="player-frame-wrap">
            <iframe src={playerUrl} title={`${site.name} Twitch stream player`} allowFullScreen />
          </div>
          <div className="player-caption">
            <span>{site.hero.playerHint[language]}</span>
            <a href={site.twitchUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.hero.playerFallback[language]} (${site.accessibility.opensNewTab[language]})`} data-testid="link-twitch-player">
              {site.hero.playerFallback[language]} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
