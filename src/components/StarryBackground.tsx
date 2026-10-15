import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

const stars = [
  [4, 12, 0, 6], [13, 31, 1.4, 4], [22, 8, 2.1, 5], [31, 46, .7, 7],
  [38, 18, 2.8, 4], [47, 39, 1.2, 6], [55, 11, 3.2, 5], [63, 29, .3, 7],
  [72, 8, 1.8, 5], [81, 43, 2.4, 6], [91, 18, .9, 4], [96, 62, 3.1, 6],
  [8, 72, 2.2, 5], [19, 87, .2, 6], [28, 68, 1.3, 4], [44, 82, 2.7, 6],
  [59, 73, .6, 5], [69, 91, 1.6, 7], [79, 77, 2.5, 4], [88, 90, .4, 6],
] as const;

export function StarryBackground() {
  const [activeStars, setActiveStars] = useState([false, false, false, false]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const timers = new Set<number>();

    const scheduleStar = (index: number) => {
      const startTimer = window.setTimeout(() => {
        timers.delete(startTimer);
        if (cancelled) return;

        setActiveStars((current) => current.map((active, starIndex) => starIndex === index ? true : active));
        const stopTimer = window.setTimeout(() => {
          timers.delete(stopTimer);
          if (cancelled) return;

          setActiveStars((current) => current.map((active, starIndex) => starIndex === index ? false : active));
          scheduleStar(index);
        }, 1500);
        timers.add(stopTimer);
      }, 8000 + Math.random() * 16000);

      timers.add(startTimer);
    };

    activeStars.forEach((_, index) => scheduleStar(index));
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(([x, y, delay, duration], index) => (
        <i className="twinkle" key={index} style={{ left: `${x}%`, top: `${y}%`, '--delay': `${delay}s`, '--duration': `${duration}s` } as CSSProperties} />
      ))}
      {['12%', '47%', '74%', '92%'].map((left, index) => (
        <i className={`shooting-star${activeStars[index] ? ' is-active' : ''}`} key={index} style={{ '--left': left } as CSSProperties} />
      ))}
    </div>
  );
}
