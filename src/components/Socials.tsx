import { ArrowUpRight } from 'lucide-react';
import { site, type Language } from '../data/site';
import { SectionHeading } from './Ornaments';

function SocialIcon({ name }: { name: string }) {
  if (name === 'twitch') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3 2.5 6.5V20h4.2v2.5h2.9l2.6-2.5h3.5l5.8-5.8V3H4Zm15 10.2-3.4 3.4h-4l-2.6 2.5v-2.5H6V5h13v8.2ZM15.5 7v4.4h-2V7h2Zm-5.2 0v4.4h-2V7h2Z"/></svg>;
  if (name === 'discord') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.7 5.1A18 18 0 0 0 15.3 4l-.5 1a16.5 16.5 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.1C1.5 9.2.8 13.2 1.1 17.1a18 18 0 0 0 5.4 2.7l1.2-2a11 11 0 0 1-1.8-.9l.4-.3a12.8 12.8 0 0 0 11.4 0l.4.3a11 11 0 0 1-1.8.9l1.2 2a18 18 0 0 0 5.4-2.7c.4-4.5-.7-8.4-3.2-12ZM8.6 14.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm6.8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"/></svg>;
  if (name === 'youtube') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.3 3.7-6.3 3.7Z"/></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2h-3.4c-.3 2.5-1.7 4.4-4.3 4.8v3.3c1.7.1 3.1-.4 4.2-1.3v6.5c0 2.1-1.2 3.4-3.1 3.4-1.7 0-2.8-1.1-2.8-2.7 0-1.7 1.2-2.8 3.1-2.8.4 0 .8.1 1.1.2v-3.5c-.5-.1-.9-.1-1.4-.1-4 0-6.5 2.5-6.5 6.2 0 3.5 2.5 5.9 6.4 5.9 4.1 0 6.5-2.7 6.5-6.7V8.7c1.3.8 2.7 1.2 4.3 1.2V6.5c-2.6-.1-4.4-1.5-4.1-4.5Z"/></svg>;
}

export function Socials({ language }: { language: Language }) {
  return <section className="section page-container" id="socials" aria-labelledby="socials-title">
    <div id="socials-title"><SectionHeading>{site.socials.title[language]}</SectionHeading></div>
    <p className="support-intro">{site.socials.intro[language]}</p>
    <div className="socials">
      {site.socials.links.map((link) => link.url ? (
        <a className="social-button" key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.name} (${site.accessibility.opensNewTab[language]})`} data-testid={`link-social-${link.name.toLowerCase()}`}>
          <SocialIcon name={link.icon} /><span>{link.name}</span><ArrowUpRight aria-hidden="true" />
        </a>
      ) : (
        <span className="social-button disabled" key={link.name} aria-disabled="true" title={site.socials.unavailable[language]}>
          <SocialIcon name={link.icon} /><span>{link.name}</span>
        </span>
      ))}
    </div>
  </section>;
}
