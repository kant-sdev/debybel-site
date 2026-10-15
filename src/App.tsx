import { useEffect, useState } from 'react';
import { About } from './components/About';
import { Games } from './components/Games';
import { Hero } from './components/Hero';
import { Rules } from './components/Rules';
import { Socials } from './components/Socials';
import { StarryBackground } from './components/StarryBackground';
import { Support } from './components/Support';
import { StarDivider } from './components/Ornaments';
import { site, type Language } from './data/site';

function App() {
  const [language, setLanguage] = useState<Language>('pt');
  useEffect(() => {
    document.title = site.meta.title;
    document.documentElement.lang = language;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', site.meta.description);
  }, [language]);

  return (
    <div className="site-shell">
      <StarryBackground />
      <a className="skip-link" href="#main-content">{site.accessibility.skipLink[language]}</a>
      <header className="topbar">
        <nav className="nav-wrap" aria-label={site.accessibility.navigationLabel[language]}>
          <a className="brand-mark" href="#top" aria-label={site.name}>DEBYBEL ✦</a>
          <div className="nav-links">
            {site.nav.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label[language]}</a>)}
          </div>
        </nav>
      </header>
      <main id="main-content">
        <div id="top"><Hero language={language} /></div>
        <StarDivider />
        <About language={language} onLanguageChange={setLanguage} />
        <StarDivider />
        <Support language={language} />
        <StarDivider />
        <Games language={language} />
        <StarDivider />
        <Rules language={language} />
        <StarDivider />
        <Socials language={language} />
      </main>
      <footer className="site-footer">
        <div className="footer-divider" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
        <p>© {new Date().getFullYear()} {site.name} · {site.footer[language]}</p>
      </footer>
    </div>
  );
}

export default App;
