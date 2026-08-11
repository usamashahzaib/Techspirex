import { ImageResponse } from "next/og";

export const alt = "TechSpireX — Web engineering studio, Lahore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded default social card. A deep committed-violet field with cyan aurora
 * glows and a crisp grid — the brand's own look, so a shared link reads as a
 * considered studio rather than default-metadata plain text. Per-route cards
 * can override this by adding their own opengraph-image in the route segment.
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
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#fbf9ff",
          backgroundColor: "#2a2051",
          backgroundImage:
            "radial-gradient(1000px 520px at 12% -10%, rgba(124,92,255,0.55), transparent 60%), radial-gradient(900px 500px at 100% 20%, rgba(16,210,246,0.45), transparent 55%), radial-gradient(700px 600px at 60% 120%, rgba(57,42,111,0.9), transparent 60%)",
        }}
      >
        {/* Fine grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "18px", zIndex: 1 }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#10d2f6",
              boxShadow: "0 0 0 10px rgba(16,210,246,0.18)",
            }}
          />
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            TechSpireX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px", zIndex: 1 }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#82eaff",
            }}
          >
            Web engineering studio · Lahore
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "66px",
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              maxWidth: "1000px",
            }}
          >
            We build the web systems behind your next stage of growth.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", zIndex: 1 }}>
          <div style={{ height: "5px", width: "72px", background: "#10d2f6", borderRadius: "3px" }} />
          <div style={{ fontSize: "24px", color: "#dcd5ee" }}>
            Engineering-led delivery for founders in the US, UK &amp; EU
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
