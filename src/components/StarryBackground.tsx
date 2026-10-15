import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

type AmbientStar = {
  id: number;
  x: number;
  y: number;
  kind: 'glyph' | 'dot';
  size: number;
  isGuide: boolean;
  duration: number;
  delay: number;
  rotationDirection: 1 | -1;
};

type ShootingSpark = {
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  delay: number;
};

type ShootingStar = {
  id: number;
  left: number;
  top: number;
  angle: number;
  length: number;
  duration: number;
  travelX: number;
  travelY: number;
  isFeatured: boolean;
  sparks: ShootingSpark[];
};

const STAR_SYMBOL_ID = 'debybel-starfield-four-point';

function createAmbientStars(count: number): AmbientStar[] {
  const glyphCount = Math.round(count * 0.3);

  return Array.from({ length: count }, (_, id) => {
    let x = 0;
    let y = 0;

    for (let attempt = 0; attempt < 36; attempt += 1) {
      x = 2 + Math.random() * 96;
      y = 3 + Math.random() * 94;

      const nearHeroContent = x > 14 && x < 88 && y > 16 && y < 68;
      const behindTitleOrPlayer = x > 28 && x < 74 && y > 21 && y < 61;

      if (behindTitleOrPlayer && Math.random() < 0.92) continue;
      if (nearHeroContent && Math.random() < 0.68) continue;
      break;
    }

    const kind = id < glyphCount ? 'glyph' : 'dot';

    return {
      id,
      x,
      y,
      kind,
      size: kind === 'glyph' ? 6 + Math.random() * 12 : 1 + Math.random() * 1.7,
      isGuide: kind === 'glyph' && id < 3,
      duration: 2.5 + Math.random() * 3.5,
      delay: -(Math.random() * 6),
      rotationDirection: Math.random() < 0.5 ? 1 : -1,
    };
  });
}

function createShootingStar(id: number): ShootingStar {
  const angle = 30 + Math.random() * 10;
  const length = 120 + Math.random() * 140;
  const travelY = window.innerHeight * (0.62 + Math.random() * 0.3);
  const travelX = -travelY * Math.tan((angle * Math.PI) / 180);

  return {
    id,
    left: 54 + Math.random() * 42,
    top: 4 + Math.random() * 26,
    angle,
    length,
    duration: 0.9 + Math.random() * 0.9,
    travelX,
    travelY,
    isFeatured: Math.random() < 0.2,
    sparks: Array.from({ length: 3 }, () => ({
      x: -length * (0.18 + Math.random() * 0.56),
      y: (Math.random() - 0.5) * 10,
      driftX: (Math.random() - 0.5) * 18,
      driftY: (Math.random() - 0.5) * 18,
      delay: Math.random() * 0.24,
    })),
  };
}

export function StarryBackground() {
  const [stars, setStars] = useState<AmbientStar[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const nextShootingStarId = useRef(0);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const updateStars = () => setStars(createAmbientStars(mobileQuery.matches ? 24 : 60));

    updateStars();
    mobileQuery.addEventListener('change', updateStars);
    return () => mobileQuery.removeEventListener('change', updateStars);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    const updateVisibility = () => setIsPageVisible(document.visibilityState === 'visible');

    updateMotionPreference();
    updateVisibility();
    motionQuery.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      motionQuery.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) setShootingStars([]);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !isPageVisible) return;

    let cancelled = false;
    let timer = 0;
    const scheduleNext = () => {
      timer = window.setTimeout(() => {
        if (cancelled || document.visibilityState !== 'visible') return;

        const nextStar = createShootingStar(nextShootingStarId.current);
        nextShootingStarId.current += 1;
        setShootingStars((current) => current.length < 2 ? [...current, nextStar] : current);
        scheduleNext();
      }, 4000 + Math.random() * 5000);
    };

    scheduleNext();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isPageVisible, reducedMotion]);

  return (
    <div className={`starfield${isPageVisible ? '' : ' is-paused'}`} aria-hidden="true">
      <svg className="starfield-symbols" aria-hidden="true" focusable="false">
        <symbol id={STAR_SYMBOL_ID} viewBox="0 0 24 24">
          <path d="M12 1C13.8 8.1 15.9 10.2 23 12C15.9 13.8 13.8 15.9 12 23C10.2 15.9 8.1 13.8 1 12C8.1 10.2 10.2 8.1 12 1Z" />
        </symbol>
      </svg>
      {stars.map((star) => {
        const style = {
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          '--twinkle-duration': `${star.duration}s`,
          '--twinkle-delay': `${star.delay}s`,
          '--rotation-from': `${star.rotationDirection * -8}deg`,
          '--rotation-to': `${star.rotationDirection * 8}deg`,
        } as CSSProperties;

        return star.kind === 'glyph' ? (
          <svg
            className={`star-glyph${star.isGuide ? ' is-guide' : ''}`}
            key={star.id}
            style={style}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <use href={`#${STAR_SYMBOL_ID}`} />
          </svg>
        ) : (
          <i className="twinkle-dot" key={star.id} style={style} />
        );
      })}
      {shootingStars.map((star) => (
        <span
          className={`shooting-star is-active${star.isFeatured ? ' is-featured' : ''}`}
          key={star.id}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            '--flight-angle': `${star.angle}deg`,
            '--flight-length': `${star.length}px`,
            '--flight-duration': `${star.duration}s`,
            '--flight-x': `${star.travelX}px`,
            '--flight-y': `${star.travelY}px`,
          } as CSSProperties}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            setShootingStars((current) => current.filter((activeStar) => activeStar.id !== star.id));
          }}
        >
          {star.sparks.map((spark, index) => (
            <svg
              className="shooting-spark"
              key={index}
              style={{
                left: `${spark.x}px`,
                top: `${spark.y}px`,
                '--spark-drift-x': `${spark.driftX}px`,
                '--spark-drift-y': `${spark.driftY}px`,
                '--spark-delay': `${spark.delay}s`,
              } as CSSProperties}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <use href={`#${STAR_SYMBOL_ID}`} />
            </svg>
          ))}
        </span>
      ))}
    </div>
  );
}
