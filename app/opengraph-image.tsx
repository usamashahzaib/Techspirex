import { ImageResponse } from "next/og";

export const alt = "TechSpireX — Web engineering studio, Lahore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded default social card. Uses the warm-neutral base and logo-derived
 * indigo from the design system so a shared link reads as a considered studio,
 * not a default-metadata blank. Per-route cards can override this by adding
 * their own opengraph-image in the route segment.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3ee",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#392a6f",
            }}
          />
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#2a2440",
            }}
          >
            TechSpireX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#392a6f",
            }}
          >
            Web engineering studio · Lahore
          </div>
          <div
            style={{
              fontSize: "62px",
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#26212f",
              maxWidth: "980px",
            }}
          >
            We build the web systems behind your next stage of growth.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ height: "4px", width: "64px", background: "#392a6f", borderRadius: "2px" }} />
          <div style={{ fontSize: "24px", color: "#5b5566" }}>
            Engineering-led delivery for founders in the US, UK &amp; EU
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
