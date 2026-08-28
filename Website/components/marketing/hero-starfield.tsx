/*
  CSS/SVG hero backdrop. It is present in the server-rendered HTML, so the hero
  never waits for hydration, a dynamic import, or a WebGL context before it has
  visual depth. Motion is limited to composited transform and opacity changes.
*/
export function HeroStarfield() {
  return (
    <div className="hero-cosmos absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-cosmos__glow hero-cosmos__glow--violet" />
      <div className="hero-cosmos__glow hero-cosmos__glow--cyan" />
      <div className="hero-cosmos__stars hero-cosmos__stars--far" />
      <div className="hero-cosmos__stars hero-cosmos__stars--near" />

      <svg
        className="hero-cosmos__orbit"
        viewBox="0 0 900 900"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <g fill="none">
          <ellipse cx="450" cy="450" rx="320" ry="126" stroke="currentColor" strokeOpacity="0.2" />
          <ellipse cx="450" cy="450" rx="246" ry="94" stroke="currentColor" strokeOpacity="0.14" transform="rotate(58 450 450)" />
          <ellipse cx="450" cy="450" rx="205" ry="74" stroke="currentColor" strokeOpacity="0.12" transform="rotate(118 450 450)" />
          <path d="M156 333C260 170 620 126 758 310" stroke="currentColor" strokeOpacity="0.1" />
          <path d="M195 610C348 758 656 708 748 532" stroke="currentColor" strokeOpacity="0.12" />
        </g>
        <g fill="currentColor">
          <circle cx="190" cy="337" r="4" />
          <circle cx="676" cy="286" r="3" />
          <circle cx="637" cy="616" r="5" />
          <circle cx="353" cy="691" r="2.5" />
          <circle cx="510" cy="242" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
