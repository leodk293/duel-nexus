"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";

const formats = ["TCG", "OCG", "GOAT"];

// ─── Holographic card component ───────────────────────────────────────────────
function HoloCard({ card }) {
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
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    glow.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(212,175,55,0.35) 0%, transparent 65%)`;
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (el) el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glow) glow.style.background = "transparent";
  }

  return (
    <Link href={`/cards/${card.id}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-md cursor-pointer transition-[transform,box-shadow] duration-150"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.7)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Holographic sheen */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-md pointer-events-none z-[2] transition-[background] duration-100"
          style={{ mixBlendMode: "screen" }}
        />
        {/* Gold frame */}
        <div
          className="absolute inset-0 rounded-md z-[3] pointer-events-none"
          style={{
            border: "1px solid rgba(212,175,55,0.4)",
            boxShadow: "inset 0 0 12px rgba(212,175,55,0.1)",
          }}
        />
        <Image
          src={card.card_images[0].image_url}
          alt={card.name}
          width={180}
          height={262}
          className="block rounded-md"
        />
        {/* Card name tooltip */}
        <div
          className="card-name-layer absolute bottom-0 left-0 right-0 px-2 pt-5 pb-2 rounded-b-md z-[4] opacity-0 transition-opacity duration-200 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 60%, transparent)",
          }}
        >
          <p
            className="font-cinzel font-bold text-center leading-tight"
            style={{
              color: "#d4af37",
              fontSize: "0.65rem",
              letterSpacing: "0.04em",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            {card.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="w-[180px] h-[262px] rounded-md"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        border: "1px solid rgba(212,175,55,0.1)",
        animation: "pulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

// ─── Format tab button ─────────────────────────────────────────────────────────
function FormatTab({ format, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-2.5 font-cinzel text-[0.7rem] tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 rounded-t-md"
      style={{
        background: active
          ? "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08))"
          : "rgba(255,255,255,0.03)",
        border: active
          ? "1px solid rgba(212,175,55,0.7)"
          : "1px solid rgba(255,255,255,0.08)",
        borderBottom: active ? "none" : "1px solid rgba(255,255,255,0.08)",
        color: active ? "#d4af37" : "rgba(232,224,204,0.5)",
        boxShadow: active ? "0 -2px 12px rgba(212,175,55,0.15)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.background = "rgba(255,255,255,0.06)";
          e.target.style.color = "rgba(212,175,55,0.7)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.background = "rgba(255,255,255,0.03)";
          e.target.style.color = "rgba(232,224,204,0.5)";
        }
      }}
    >
      {format}
      {active && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "#d4af37" }}
        />
      )}
    </button>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children, color }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 mt-10">
      <span
        className="font-cinzel text-[0.68rem] tracking-[0.18em] uppercase whitespace-nowrap font-bold"
        style={{ color }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Banlist() {
  const [activeFormat, setActiveFormat] = useState("TCG");
  const [banlist, setBanlist] = useState({ error: false, loading: false, data: [] });

  async function fetchBanlist(format) {
    setBanlist({ error: false, loading: true, data: [] });
    try {
      const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=${format}`);
      if (!res.ok) throw new Error("Fetch failed");
      const result = await res.json();
      setBanlist({ error: false, loading: false, data: result.data });
    } catch (error) {
      setBanlist({ error: true, loading: false, data: [] });
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchBanlist(activeFormat);
  }, [activeFormat]);

  // ── Categorize cards by restriction level ─────────────────────────────────
  const banned = [];
  const limited = [];
  const semiLimited = [];

  banlist.data.forEach((card) => {
    const info = card.banlist_info;
    if (!info) return;
    const key = `ban_${activeFormat.toLowerCase()}`;
    const status = info[key];
    if (status === "Banned") banned.push(card);
    else if (status === "Limited") limited.push(card);
    else if (status === "Semi-Limited") semiLimited.push(card);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

        .font-cinzel  { font-family: 'Cinzel', serif; }
        .font-crimson { font-family: 'Crimson Pro', serif; }

        /* Scanline grain */
        body::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px);
          opacity: 0.5;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15); }
          50%       { text-shadow: 0 0 30px rgba(212,175,55,0.7), 0 0 90px rgba(212,175,55,0.3); }
        }

        .card-wrapper:hover .card-name-layer { opacity: 1 !important; }
        .card-enter { animation: fadeUp 0.35s ease both; }
      `}</style>

      {/* Page shell */}
      <div
        className="min-h-screen pb-20 relative overflow-hidden flex flex-col items-center"
        style={{ background: "#07080d", color: "#e8e0cc" }}
      >
        {/* Ambient orbs */}
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            top: "-240px",
            left: "50%",
            width: "900px",
            height: "900px",
            background: "radial-gradient(circle, rgba(212,175,55,0.065) 0%, transparent 65%)",
            animation: "orbFloat 9s ease-in-out infinite",
          }}
        />
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            top: "35%",
            right: "-350px",
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, rgba(60,30,160,0.055) 0%, transparent 65%)",
          }}
        />
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            bottom: "10%",
            left: "-200px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(220,50,50,0.04) 0%, transparent 65%)",
          }}
        />

        {/* ── Header ── */}
        <header className="w-full pt-12 px-6 flex flex-col items-center relative z-10">
          {/* Top rule */}
          <div
            className="w-[120px] h-px mb-6"
            style={{ background: "linear-gradient(to right, transparent, #d4af37, transparent)" }}
          />

          {/* Eyebrow */}
          <p
            className="font-cinzel text-[0.6rem] tracking-[0.3em] uppercase mb-2.5"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Forbidden & Restricted
          </p>

          {/* Title */}
          <h1
            className="font-cinzel font-black text-[clamp(2rem,5vw,3.6rem)] tracking-[0.12em] uppercase mb-2"
            style={{
              color: "transparent",
              background: "linear-gradient(135deg, #d4af37 0%, #f5e27a 40%, #d4af37 60%, #9a7b1a 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s linear infinite, titleGlow 3s ease-in-out infinite",
            }}
          >
            Banlist
          </h1>

          {/* Subtitle */}
          <p
            className="font-crimson italic text-[0.95rem] mb-8 tracking-[0.08em]"
            style={{ color: "rgba(232,224,204,0.4)" }}
          >
            Cards bound by the seal of regulation.
          </p>

          {/* Bottom rule */}
          <div className="flex items-center gap-3 w-full max-w-[860px]">
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3))" }}
            />
            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "0.7rem" }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.3))" }}
            />
          </div>
        </header>

        {/* ── Format tabs ── */}
        <section className="w-full max-w-[900px] px-6 pt-8 relative z-10">
          <div className="flex gap-1 justify-center">
            {formats.map((format) => (
              <FormatTab
                key={format}
                format={format}
                active={activeFormat === format}
                onClick={() => setActiveFormat(format)}
              />
            ))}
          </div>
        </section>

        {/* ── Results area ── */}
        <main className="w-full max-w-[1200px] px-4 z-10 relative">
          {/* States */}
          {banlist.error ? (
            <div className="text-center mt-20">
              <div className="text-[2.2rem] mb-3.5">⚠</div>
              <p
                className="font-cinzel text-[0.8rem] tracking-[0.1em] mb-5"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                A dark force interrupted the summon.
              </p>
              <button
                onClick={() => fetchBanlist(activeFormat)}
                className="font-cinzel text-[0.62rem] tracking-[0.1em] px-[22px] py-[9px] rounded-sm cursor-pointer transition-all duration-200"
                style={{
                  background: "none",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(212,175,55,0.08)";
                  e.target.style.boxShadow = "0 0 16px rgba(212,175,55,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.boxShadow = "none";
                }}
              >
                Retry Summon
              </button>
            </div>
          ) : banlist.loading ? (
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ── Banned section ── */}
              {banned.length > 0 && (
                <div>
                  <SectionHeading color="rgba(220,50,50,0.8)">
                    Banned ({banned.length})
                  </SectionHeading>
                  <div className="flex flex-wrap justify-center gap-4">
                    {banned.map((card, i) => (
                      <div
                        key={card.id ?? nanoid(8)}
                        className="card-enter"
                        style={{ animationDelay: `${Math.min(i, 16) * 0.04}s` }}
                      >
                        <HoloCard card={card} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Limited section ── */}
              {limited.length > 0 && (
                <div>
                  <SectionHeading color="rgba(220,120,0,0.85)">
                    Limited ({limited.length})
                  </SectionHeading>
                  <div className="flex flex-wrap justify-center gap-4">
                    {limited.map((card, i) => (
                      <div
                        key={card.id ?? nanoid(8)}
                        className="card-enter"
                        style={{ animationDelay: `${Math.min(i, 16) * 0.04}s` }}
                      >
                        <HoloCard card={card} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Semi-Limited section ── */}
              {semiLimited.length > 0 && (
                <div>
                  <SectionHeading color="rgba(200,180,0,0.85)">
                    Semi-Limited ({semiLimited.length})
                  </SectionHeading>
                  <div className="flex flex-wrap justify-center gap-4">
                    {semiLimited.map((card, i) => (
                      <div
                        key={card.id ?? nanoid(8)}
                        className="card-enter"
                        style={{ animationDelay: `${Math.min(i, 16) * 0.04}s` }}
                      >
                        <HoloCard card={card} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {banned.length === 0 && limited.length === 0 && semiLimited.length === 0 && (
                <div className="text-center mt-20">
                  <div className="text-[2.2rem] mb-3.5">🔮</div>
                  <p
                    className="font-cinzel text-[0.78rem] tracking-[0.08em]"
                    style={{ color: "rgba(212,175,55,0.45)" }}
                  >
                    No restricted cards in this format.
                  </p>
                </div>
              )}

              {/* End message */}
              {(banned.length > 0 || limited.length > 0 || semiLimited.length > 0) && (
                <p
                  className="font-cinzel text-[0.58rem] tracking-[0.18em] uppercase text-center py-9 mt-8"
                  style={{ color: "rgba(212,175,55,0.28)" }}
                >
                  ✦ {activeFormat} banlist complete ✦
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}