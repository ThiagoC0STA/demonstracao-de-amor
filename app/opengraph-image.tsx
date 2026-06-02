import { ImageResponse } from "next/og";

// Static-ish OG image generated at build/request time with next/og.
// Uses only Latin text + CSS (next/og ships a default Latin font), so no
// external font file is required.
export const alt = "Para Lilian — uma carta para você.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, #1a1410 0%, #0A0A0B 70%)",
          color: "#F5F1EA",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#D4AF7A" }}>
          UMA CARTA
        </div>
        <div
          style={{
            fontSize: 120,
            fontStyle: "italic",
            marginTop: 12,
            color: "#F5F1EA",
          }}
        >
          Para Lilian
        </div>
        <div style={{ fontSize: 30, marginTop: 20, color: "#A8A29E" }}>
          uma carta para você.
        </div>
      </div>
    ),
    { ...size },
  );
}
