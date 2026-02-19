"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRef } from "react";

export default function HoloCard({ card }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  function handleMouseMove(e) {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) * 12;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
    el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.25)`;
    glow.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 65%)`;
  }
  function handleMouseLeave() {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (el) {
      el.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
      el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.7)";
    }
    if (glow) glow.style.background = "transparent";
  }
  return (
    <Link href={`/card/${card.id}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          transition: "transform 0.15s ease, box-shadow 0.2s ease",
          transformStyle: "preserve-3d",
          borderRadius: "6px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.7)",
          cursor: "pointer",
          willChange: "transform",
        }}
        className="card-wrapper"
      >
        <div
          ref={glowRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "6px",
            pointerEvents: "none",
            zIndex: 2,
            transition: "background 0.08s ease",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "6px",
            border: "1px solid rgba(212,175,55,0.35)",
            zIndex: 3,
            pointerEvents: "none",
            boxShadow: "inset 0 0 14px rgba(212,175,55,0.08)",
          }}
        />
        <Image
          src={card.image}
          alt={card.name}
          width={180}
          height={262}
          style={{ borderRadius: "6px", display: "block" }}
        />
        <div
          className="card-name-layer"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 8px 10px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 60%, transparent)",
            borderRadius: "0 0 6px 6px",
            zIndex: 4,
            opacity: 0,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              color: "#d4af37",
              fontSize: "0.62rem",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
              textShadow: "0 1px 6px rgba(0,0,0,1)",
            }}
          >
            {card.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
