import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 80, background: "#0a0b0d", color: "#ecedee",
          backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#3ee69a", letterSpacing: 6 }}>{profile.name.toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>{profile.headline[0]}</div>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05, color: "#38d6f5" }}>{profile.headline[1]}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8b9098" }}>
          {profile.tagline} · {profile.location}
        </div>
      </div>
    ),
    size,
  );
}
