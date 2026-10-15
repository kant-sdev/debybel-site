import { site, type Language } from '../data/site';
import { SectionHeading } from './Ornaments';

export function Rules({ language }: { language: Language }) {
  return (
    <section className="section section-alt" id="rules" aria-labelledby="rules-title">
      <div className="page-container">
        <div id="rules-title"><SectionHeading>{site.rules.title[language]}</SectionHeading></div>
        <article className="rules-card">
          <svg className="rules-moon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M26 7.5a14 14 0 1 0 7 24.2A15 15 0 0 1 26 7.5Z" stroke="currentColor" strokeWidth="1.4"/><path d="M21 3v4m13 3h-4M8 10l2 3m20 12 3 1" stroke="currentColor" strokeWidth="1"/></svg>
          <ol className="rules-list">{site.rules.items.map((rule) => <li key={rule.pt}>{rule[language]}</li>)}</ol>
          <p className="mod-note"><span className="mini-label">{site.rules.modLabel[language]}</span><strong>{site.rules.modNote[language]}</strong></p>
        </article>
      </div>
    </section>
  );
}
