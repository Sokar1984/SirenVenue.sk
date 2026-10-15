import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, message } from "@/modules/i18n";
import { tokens } from "@/modules/tokens";

/** Social card, 1200x630. Monogram, name, the locale's own tagline. Nothing else. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SirenVenue";

// The monogram's single path, lifted from the brand file so the card and the
// site draw the same mark.
const monogram = readFileSync(
  join(process.cwd(), "public/brand/sv-monogram.svg"),
  "utf8",
);
const pathD = monogram.match(/ d="([^"]+)"/)?.[1] ?? "";
const viewBox = monogram.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 289 355";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = isLocale(locale) ? message(locale, "colophon") : null;
  const { bg, fg, muted } = tokens.color;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "88px 96px",
          background: bg,
          color: fg,
        }}
      >
        <svg width="120" height="148" viewBox={viewBox}>
          <path fill={fg} d={pathD} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, letterSpacing: "-0.03em", lineHeight: 1 }}>
            SirenVenue
          </div>
          {tagline ? (
            <div style={{ fontSize: 34, color: muted, lineHeight: 1.3 }}>
              {tagline}
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
