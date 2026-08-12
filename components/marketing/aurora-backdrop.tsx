/*
  Premium decorative backdrop: layered radial "aurora" blooms + a fine grid +
  an SVG-generated grain texture (feTurbulence). Pure inline SVG - no raster
  asset, no network request, scales crisply on any display, and stays tiny.
  Fully decorative, so aria-hidden and pointer-events-none. Colors are passed
  in so it can sit on any section background.
*/
export function AuroraBackdrop({
  className = "",
  from = "#392a6f",
  via = "#7c5cff",
  to = "#10d2f6",
  grain = 0.28,
}: {
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  grain?: number;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="aurora-a" cx="18%" cy="12%" r="55%">
            <stop offset="0%" stopColor={via} stopOpacity="0.55" />
            <stop offset="100%" stopColor={via} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aurora-b" cx="88%" cy="20%" r="50%">
            <stop offset="0%" stopColor={to} stopOpacity="0.5" />
            <stop offset="100%" stopColor={to} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aurora-c" cx="62%" cy="98%" r="60%">
            <stop offset="0%" stopColor={from} stopOpacity="0.6" />
            <stop offset="100%" stopColor={from} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="aurora-grid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <pattern id="aurora-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="url(#aurora-grid)" strokeWidth="1" />
          </pattern>
          <filter id="aurora-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope={grain} />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>

        <rect width="1200" height="600" fill="url(#aurora-c)" />
        <rect width="1200" height="600" fill="url(#aurora-a)" />
        <rect width="1200" height="600" fill="url(#aurora-b)" />
        <rect width="1200" height="600" fill="url(#aurora-grid-pattern)" />
        {/* Grain layer on top, blended subtly. */}
        <rect width="1200" height="600" filter="url(#aurora-grain)" opacity="0.5" style={{ mixBlendMode: "overlay" }} />
      </svg>
    </div>
  );
}
