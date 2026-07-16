import React from "react";

/**
 * BusIcon.tsx
 *
 * Simple front-view bus glyph for the Login hero. Pure inline SVG so
 * it inherits color via `currentColor` and needs no image asset.
 */
export default function BusIcon({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="20" y="10" width="60" height="65" rx="14" fill="currentColor" />
      <rect x="30" y="22" width="40" height="22" rx="4" fill="white" />
      <rect x="30" y="8" width="20" height="5" rx="2.5" fill="white" />
      <circle cx="36" cy="72" r="7" fill="currentColor" />
      <circle cx="64" cy="72" r="7" fill="currentColor" />
      <circle cx="36" cy="72" r="3" fill="white" />
      <circle cx="64" cy="72" r="3" fill="white" />
    </svg>
  );
}
