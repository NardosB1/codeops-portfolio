import { ImageResponse } from "next/og";
import { getDish } from "@/lib/dishes";
import { formatEtb } from "@/lib/format";

// A per-dish social card. Defined here because a child page that sets its own
// openGraph metadata does not inherit the root opengraph-image.
export const alt = "A dish on the Addis Eats menu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DishOgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await getDish(id);

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
        <div style={{ display: "flex", fontSize: 36, opacity: 0.8 }}>Addis Eats</div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, marginTop: 16 }}>
          {dish ? dish.name : "Addis Eats"}
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 24 }}>
          {dish ? `${dish.category} · ${formatEtb(dish.priceEtb)}` : "Ethiopian food, delivered"}
        </div>
      </div>
    ),
    { ...size },
  );
}
