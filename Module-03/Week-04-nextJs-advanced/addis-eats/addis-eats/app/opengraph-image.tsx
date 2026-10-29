import { ImageResponse } from "next/og";

// Social-share card for every page that has no image of its own. Generated once at build time.
export const alt = "Addis Eats: Ethiopian food delivered across Addis Ababa";
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
          justifyContent: "center",
          padding: 80,
          background: "#171717",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>Addis Eats</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 24 }}>
          Ethiopian food, delivered across Addis Ababa
        </div>
      </div>
    ),
    { ...size },
  );
}
