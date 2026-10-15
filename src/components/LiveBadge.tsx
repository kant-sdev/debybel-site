import { getLiveStatus } from '../lib/twitch';
import type { Language } from '../data/site';

export function LiveBadge({ language }: { language: Language }) {
  const live = getLiveStatus();
  return <span className={`live-badge ${live ? 'is-live' : ''}`} data-testid="status-live">
    <i className="live-dot" aria-hidden="true" />
    {live ? (language === 'pt' ? 'AO VIVO' : 'LIVE') : 'OFFLINE'}
  </span>;
}
