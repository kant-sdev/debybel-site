import type { Language } from '../data/site';

export function LiveBadge({ language, isLive }: { language: Language; isLive: boolean }) {
  return <span className={`live-badge ${isLive ? 'is-live' : ''}`} data-testid="status-live">
    <i className="live-dot" aria-hidden="true" />
    {isLive ? (language === 'pt' ? 'AO VIVO' : 'LIVE') : 'OFFLINE'}
  </span>;
}
