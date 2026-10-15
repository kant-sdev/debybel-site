export function PlanetOrnament() {
  return <svg className="ornament" viewBox="0 0 40 40" fill="none" aria-hidden="true"><ellipse cx="20" cy="20" rx="7" ry="7" stroke="currentColor" strokeWidth="1"/><ellipse cx="20" cy="20" rx="17" ry="5.8" stroke="currentColor" strokeWidth="1" transform="rotate(-28 20 20)"/><circle cx="20" cy="20" r="2" fill="currentColor"/></svg>;
}
export function MoonOrnament() {
  return <svg className="ornament" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M25.5 7.5a14 14 0 1 0 7 24.5A15 15 0 0 1 25.5 7.5Z" stroke="currentColor" strokeWidth="1.2"/><path d="M28 4v4M35 11h-4M10 9l2.5 3M7 18h4M33 22l3 1M16 4l1 3" stroke="currentColor" strokeWidth="1"/></svg>;
}
export function EightPointStar() {
  return <svg className="ornament-eight" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1.5 14 9.3 21.5 4.5 14.8 10.5 22.5 12 14.8 13.5 21.5 19.5 14 14.7 12 22.5 10 14.7 2.5 19.5 9.2 13.5 1.5 12 9.2 10.5 2.5 4.5 10 9.3 12 1.5Z" stroke="currentColor" strokeWidth="1"/></svg>;
}
export function StarDivider() {
  return <div className="divider" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2.5 14 10l7.5 2-7.5 2-2 7.5L10 14l-7.5-2 7.5-2 2-7.5Z" stroke="currentColor" strokeWidth="1"/></svg><EightPointStar /></div>;
}
export function SectionHeading({ children }: { children: string }) {
  return <div className="section-heading"><PlanetOrnament /><h2>{children}</h2><MoonOrnament /></div>;
}
