/*
  Static vector counterpart to the hero backdrop. Repeated section backgrounds
  should not each own an animation loop, so this keeps the shared orbital motif
  without client JavaScript, canvas allocation, or continuous main-thread work.
*/
type Variant = "field" | "assembly";

export function AmbientNodeField({
  variant = "field",
  tone = "dark",
}: {
  variant?: Variant;
  tone?: "dark" | "light";
}) {
  return (
    <div className="ambient-orbit" data-variant={variant} data-tone={tone} aria-hidden="true">
      <svg viewBox="0 0 760 560" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className="ambient-orbit__mesh" fill="none" stroke="currentColor">
          <ellipse cx="510" cy="235" rx="228" ry="82" />
          <ellipse cx="510" cy="235" rx="180" ry="64" transform="rotate(57 510 235)" />
          <ellipse cx="510" cy="235" rx="146" ry="50" transform="rotate(116 510 235)" />
          <ellipse cx="510" cy="235" rx="105" ry="225" transform="rotate(25 510 235)" />
          <path d="M283 235H737M510 8V462M319 109L701 361M332 382L688 88" />
        </g>
        <g className="ambient-orbit__nodes" fill="currentColor">
          <circle cx="283" cy="235" r="3" />
          <circle cx="404" cy="170" r="2.5" />
          <circle cx="510" cy="8" r="3.5" />
          <circle cx="588" cy="102" r="2.5" />
          <circle cx="688" cy="88" r="4" />
          <circle cx="701" cy="361" r="3" />
          <circle cx="510" cy="462" r="4" />
          <circle cx="332" cy="382" r="2.5" />
        </g>
        <g className="ambient-orbit__signals" fill="currentColor">
          <circle cx="404" cy="170" r="6" />
          <circle cx="688" cy="88" r="7" />
          <circle cx="510" cy="462" r="5" />
        </g>
      </svg>
    </div>
  );
}
