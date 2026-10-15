import { useState } from 'react';
import { ArrowUpRight, CircleDollarSign, Gamepad2, Gift, Heart, MoonStar, Sparkles } from 'lucide-react';
import { site, type Language } from '../data/site';
import { SectionHeading } from './Ornaments';

const supportIcons = { heart: Heart, sparkle: Sparkles, game: Gamepad2, gift: Gift, moon: MoonStar };

export function Support({ language }: { language: Language }) {
  const [copied, setCopied] = useState(false);
  async function copyMidCommand() {
    try {
      await navigator.clipboard.writeText('!mid');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return (
    <section className="section section-alt" id="support" aria-labelledby="support-title">
      <div className="page-container">
        <div id="support-title"><SectionHeading>{site.support.title[language]}</SectionHeading></div>
        <p className="support-intro">{site.support.intro[language]}</p>
        <div className="support-grid">
          {site.support.cards.map((card) => {
            const Icon = supportIcons[card.icon];
            return <article className="support-card" key={card.id}>
              <div className="support-top"><span className="support-icon"><Icon aria-hidden="true" /></span><h3>{card.title}</h3></div>
              <p>{card.description[language]}</p>
              {'commandOnly' in card && card.commandOnly ? (
                <button className="support-link" type="button" onClick={copyMidCommand} aria-label={site.accessibility.copyMid[language]} data-testid="button-copy-mid">
                  <span>{copied ? site.accessibility.copied[language] : card.action[language]}</span>{copied ? null : <CircleDollarSign aria-hidden="true" />}
                </button>
              ) : card.url ? (
                <a className="support-link" href={card.url} target="_blank" rel="noopener noreferrer" aria-label={`${card.action[language]} — ${card.title} (${site.accessibility.opensNewTab[language]})`} data-testid={`link-support-${card.id}`}>
                  {card.action[language]}<ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span className="support-link disabled" aria-disabled="true" title={site.socials.unavailable[language]}>{card.action[language]}<span aria-hidden="true"> ·</span></span>
              )}
            </article>;
          })}
        </div>
        <div className="subs-panel">
          <div><h3>{site.support.subsTitle[language]}</h3><span className="mini-label">{site.support.subsAside[language]}</span></div>
          <p>{site.support.subsBenefits[language]}</p>
        </div>
        <div className="reward-tables">
          <RewardTable title={site.support.subsTableTitle[language]} rows={site.support.subRewards} />
          <RewardTable title={site.support.bitsTableTitle[language]} rows={site.support.bitRewards} />
          <div className="reward-box">
            <h3>{site.support.pixTableTitle[language]}</h3>
            {site.support.pixRewards.map((row) => <div className="reward-row" key={row.amount}><span>{row.amount}</span><span>{row.reward[language]}</span></div>)}
          </div>
        </div>
        <p className="donation-note"><strong>{site.support.donationNote[language]}</strong><br />{site.support.nonRefundable[language]}</p>
        <div className="artist-note"><span>{site.support.artistsTitle[language]}: </span>{site.support.artists.join(' · ')}</div>
      </div>
    </section>
  );
}

function RewardTable({ title, rows }: { title: string; rows: ReadonlyArray<{ amount: string; reward: string }> }) {
  return <div className="reward-box">
    <h3>{title}</h3>
    {rows.map((row) => <div className="reward-row" key={row.amount}><span>{row.amount}</span><span>{row.reward}</span></div>)}
  </div>;
}
