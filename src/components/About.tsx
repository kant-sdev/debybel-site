import { Star } from 'lucide-react';
import { site, type Language } from '../data/site';
import { SectionHeading } from './Ornaments';

export function About({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  return (
    <section className="section page-container" id="about" aria-labelledby="about-title">
      <div id="about-title"><SectionHeading>{site.about.title[language]}</SectionHeading></div>
      <div className="about-layout">
        <div>
          <div className="language-switch" role="group" aria-label={site.about.languageLabel[language]}>
            <button type="button" aria-pressed={language === 'pt'} onClick={() => onLanguageChange('pt')} data-testid="button-language-pt">PT</button>
            <button type="button" aria-pressed={language === 'en'} onClick={() => onLanguageChange('en')} data-testid="button-language-en">EN</button>
          </div>
          <p className="about-copy">{site.about.text[language]}</p>
          <ul className="facts">
            {site.about.facts.map((fact) => (
              <li className="fact" key={fact.pt}>
                {fact.symbol === 'aries' ? <span className="fact-symbol" role="img" aria-label={site.accessibility.aries[language]}>♈︎</span> : <Star aria-hidden="true" />}
                <span>{fact[language]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-commands">
          <span className="mini-label">{site.about.commandsLabel[language]}</span>
          <div className="chips">
            {site.about.commands.map((command) => <span className="command-chip" key={command}>{command}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
