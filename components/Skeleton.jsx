import React from "react";

export default function SkeletonCard() {
  return (
    <div
      style={{
        width: "180px",
        height: "262px",
        borderRadius: "6px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        border: "1px solid rgba(212,175,55,0.08)",
        animation: "skeletonPulse 1.8s ease-in-out infinite",
      }}
    />
  );
}
