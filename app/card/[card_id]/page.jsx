"use client";
import React from "react";
import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";


const ATTRIBUTE_COLORS = {
  DARK: {
    bg: "rgba(80,20,120,0.25)",
    border: "rgba(150,60,220,0.5)",
    text: "#c47bff",
  },
  LIGHT: {
    bg: "rgba(200,170,0,0.18)",
    border: "rgba(255,220,60,0.5)",
    text: "#ffe55c",
  },
  FIRE: {
    bg: "rgba(180,40,0,0.22)",
    border: "rgba(255,90,30,0.5)",
    text: "#ff7040",
  },
  WATER: {
    bg: "rgba(0,80,160,0.22)",
    border: "rgba(40,160,255,0.5)",
    text: "#5bb8ff",
  },
  EARTH: {
    bg: "rgba(80,55,20,0.25)",
    border: "rgba(180,130,60,0.5)",
    text: "#c8934a",
  },
  WIND: {
    bg: "rgba(0,120,60,0.2)",
    border: "rgba(40,220,120,0.5)",
    text: "#44e896",
  },
  DIVINE: {
    bg: "rgba(200,160,0,0.2)",
    border: "rgba(255,210,80,0.5)",
    text: "#ffd44a",
  },
  DEFAULT: {
    bg: "rgba(212,175,55,0.12)",
    border: "rgba(212,175,55,0.4)",
    text: "#d4af37",
  },
};
function attrStyle(attr) {
  return ATTRIBUTE_COLORS[(attr || "").toUpperCase()] || ATTRIBUTE_COLORS.DEFAULT;
}

// ─── Holographic card art ─────────────────────────────────────────────────────
function HoloCardArt({ src, alt }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  function onMove(e) {
    const el = cardRef.current;
    const g = glowRef.current;
    if (!el || !g) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rX = ((y - cy) / cy) * -14;
    const rY = ((x - cx) / cx) * 14;
    const pX = (x / r.width) * 100;
    const pY = (y / r.height) * 100;
    el.style.transform = `perspective(700px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.03)`;
    el.style.boxShadow =
      "0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.3)";
    g.style.background = `radial-gradient(circle at ${pX}% ${pY}%, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.12) 40%, transparent 65%)`;
  }
  function onLeave() {
    const el = cardRef.current;
    const g = glowRef.current;
    if (el) {
      el.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
      el.style.boxShadow = "0 12px 50px rgba(0,0,0,0.8)";
    }
    if (g) g.style.background = "transparent";
  }

  // Corner bracket positions: [top, bottom] × [left, right]
  const corners = [
    "top-1.5 left-1.5 border-t border-l",
    "top-1.5 right-1.5 border-t border-r",
    "bottom-1.5 left-1.5 border-b border-l",
    "bottom-1.5 right-1.5 border-b border-r",
  ];

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative rounded-lg flex-shrink-0 transition-[transform,box-shadow] duration-150 ease-out"
      style={{
        boxShadow: "0 12px 50px rgba(0,0,0,0.8)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Holo sheen overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-lg pointer-events-none z-[2] transition-[background] duration-75"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Corner ornaments */}
      {corners.map((cls, i) => (
        <div
          key={i}
          className={`absolute w-[18px] h-[18px] z-[3] pointer-events-none ${cls}`}
          style={{ borderColor: "rgba(212,175,55,0.7)" }}
        />
      ))}
      {/* Card image */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid rgba(212,175,55,0.3)" }}
      >
        <Image src={src} alt={alt} width={300} height={438} className="block" />
      </div>
    </div>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ label, value, accent }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div
      className="flex items-baseline gap-2.5 py-[7px]"
      style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}
    >
      <span
        className="font-cinzel text-[10px] tracking-[0.14em] uppercase min-w-[90px] shrink-0"
        style={{ color: "rgba(212,175,55,0.5)" }}
      >
        {label}
      </span>
      <span
        className="font-crimson text-[0.95rem] leading-snug"
        style={{ color: accent || "#e8e0cc" }}
      >
        {String(value)}
      </span>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }) {
  if (value === undefined || value === null) return null;
  return (
    <div
      className="flex flex-col items-center px-[18px] py-2.5 rounded min-w-[72px]"
      style={{
        background: "rgba(212,175,55,0.07)",
        border: "1px solid rgba(212,175,55,0.2)",
      }}
    >
      <span
        className="font-cinzel text-xs tracking-[0.16em] uppercase mb-1"
        style={{ color: "rgba(212,175,55,0.5)" }}
      >
        {label}
      </span>
      <span
        className="font-cinzel font-bold text-[1.1rem] tracking-[0.04em]"
        style={{ color: "#d4af37" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Price cell ───────────────────────────────────────────────────────────────
function PriceCell({ label, value }) {
  const num = parseFloat(value);
  const display =
    !value || isNaN(num) || num === 0 ? "—" : `$${num.toFixed(2)}`;
  const isReal = display !== "—";
  return (
    <div
      className="flex flex-col items-center gap-1 px-3 py-3.5 rounded min-w-[100px]"
      style={{
        background: "rgba(212,175,55,0.04)",
        border: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      <span
        className="font-cinzel text-xs tracking-[0.12em] uppercase text-center"
        style={{ color: "rgba(212,175,55,0.4)" }}
      >
        {label}
      </span>
      <span
        className="font-cinzel font-bold text-[1rem] tracking-[0.04em]"
        style={{ color: isReal ? "#d4af37" : "rgba(212,175,55,0.2)" }}
      >
        {display}
      </span>
    </div>
  );
}

// ─── Set badge ────────────────────────────────────────────────────────────────
function SetBadge({ set }) {
  return (
    <div
      className="inline-flex flex-col gap-0.5 px-3 py-1.5 rounded"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span
        className="font-cinzel text-[0.6rem] tracking-[0.06em]"
        style={{ color: "rgba(212,175,55,0.7)" }}
      >
        {set.set_code}
      </span>
      <span
        className="font-crimson text-sm leading-snug"
        style={{ color: "rgba(232,224,204,0.55)" }}
      >
        {set.set_name}
      </span>
      <span
        className="font-crimson italic text-sm"
        style={{ color: "rgba(232,224,204,0.35)" }}
      >
        {set.set_rarity}
      </span>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 mt-8">
      <span
        className="font-cinzel text-[0.6rem] tracking-[0.2em] uppercase whitespace-nowrap"
        style={{ color: "rgba(212,175,55,0.6)" }}
      >
        {children}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(to right, rgba(212,175,55,0.3), transparent)",
        }}
      />
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ w, h, radius }) {
  return (
    <div
      className="animate-pulse"
      style={{
        width: w || "100%",
        height: h || "16px",
        borderRadius: radius || "3px",
        background: "rgba(212,175,55,0.06)",
        animation: "skeletonPulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CardPage({ params }) {
  const resolvedParams = use(params);
  const card_id = resolvedParams.card_id;

  const [cardData, setCardData] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function fetchCardData() {
    setCardData({ error: false, loading: true, data: [] });
    try {
      const res = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card_id}`,
      );
      if (!res.ok) throw new Error();
      const result = await res.json();
      setCardData({ error: false, loading: false, data: result.data });
    } catch {
      setCardData({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    fetchCardData();
  }, []);

  const card = cardData.data?.[0];
  const prices = card?.card_prices?.[0] ?? {};
  const sets = card?.card_sets ?? [];
  const images = card?.card_images ?? [];
  const aStyle = attrStyle(card?.attribute);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        .font-cinzel  { font-family: 'Cinzel', serif; }
        .font-crimson { font-family: 'Crimson Pro', serif; }

        /* Scanline grain */
        body::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px);
          opacity: 0.5;
        }

        @keyframes skeletonPulse { 0%,100%{opacity:0.35} 50%{opacity:0.65} }
        @keyframes fadeUp        { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer       { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes orbDrift      { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.06)} }
        @keyframes descReveal    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .animate-fade-up   { animation: fadeUp    0.5s       ease both; }
        .animate-fade-up-2 { animation: fadeUp    0.5s 0.1s  ease both; }
        .animate-fade-up-3 { animation: fadeUp    0.5s 0.2s  ease both; }
        .animate-desc      { animation: descReveal 0.6s 0.25s ease both; opacity: 0; }
        .animate-shimmer   { animation: shimmer    6s  linear infinite; background-size: 200% auto; }

        .alt-img-thumb {
          border-radius: 4px; overflow: hidden; cursor: pointer;
          transition: border-color 0.2s, transform 0.15s, opacity 0.2s;
          border: 1px solid rgba(212,175,55,0.2); opacity: 0.65;
        }
        .alt-img-thumb:hover { border-color: rgba(212,175,55,0.6); transform: scale(1.04); opacity: 1; }
        .alt-img-thumb.active { border-color: rgba(212,175,55,0.8); opacity: 1; }
      `}</style>

      {/* Page shell */}
      <div
        className="min-h-screen pb-20 relative overflow-hidden"
        style={{ background: "#07080d", color: "#e8e0cc" }}
      >
        {/* Ambient orbs */}
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            top: "-200px",
            left: "30%",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle,rgba(212,175,55,0.055) 0%,transparent 65%)",
            animation: "orbDrift 10s ease-in-out infinite",
          }}
        />
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            bottom: "-150px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle,rgba(60,20,150,0.05) 0%,transparent 65%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-cinzel text-[0.6rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200"
            style={{ color: "rgba(212,175,55,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(212,175,55,0.5)")
            }
          >
            <span className="text-[0.8rem]">←</span> Card Database
          </Link>

          {/* Loading skeleton */}
          {cardData.loading && (
            <div className="mt-12 flex gap-10 flex-wrap">
              <Skeleton w="300px" h="438px" radius="8px" />
              <div className="flex-1 min-w-[280px] flex flex-col gap-3.5 pt-2">
                <Skeleton w="60%" h="14px" />
                <Skeleton w="45%" h="36px" />
                <Skeleton w="80%" h="12px" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} h="12px" />
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {cardData.error && (
            <div className="mt-20 text-center">
              <div className="text-[2.5rem] mb-4">⚠</div>
              <p
                className="font-cinzel text-[0.8rem] tracking-[0.1em] mb-5"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                A dark force interrupted the summon.
              </p>
              <button
                onClick={fetchCardData}
                className="font-cinzel text-[0.62rem] tracking-[0.1em] px-[22px] py-[9px] rounded-sm cursor-pointer transition-all duration-200"
                style={{
                  background: "none",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(212,175,55,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                Retry Summon
              </button>
            </div>
          )}

          {/* Card detail */}
          {card && (
            <CardDetail
              card={card}
              images={images}
              prices={prices}
              sets={sets}
              aStyle={aStyle}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Card detail ──────────────────────────────────────────────────────────────
function CardDetail({ card, images, prices, sets, aStyle }) {
  const [activeImg, setActiveImg] = useState(0);

  const priceEntries = [
    { label: "TCGPlayer Low", value: prices.tcgplayer_price },
    { label: "TCGPlayer Mid", value: prices.tcg_price },
    { label: "eBay", value: prices.ebay_price },
    { label: "Amazon", value: prices.amazon_price },
    { label: "Cool Stuff Inc", value: prices.coolstuffinc_price },
    { label: "Cardmarket", value: prices.cardmarket_price },
  ];

  const hasATK = card.atk !== undefined && card.atk !== null;
  const hasDEF = card.def !== undefined && card.def !== null;
  const hasLevel = card.level !== undefined;
  const hasLink = card.linkval !== undefined;
  const hasPrices = priceEntries.some(
    (p) => p.value && parseFloat(p.value) > 0,
  );

  return (
    <>
      {/* ── Art + core info ── */}
      <div className="mt-9 flex gap-10 flex-wrap items-start">
        {/* Card art column */}
        <div className="animate-fade-up flex flex-col gap-3">
          <HoloCardArt
            src={images[activeImg]?.image_url ?? images[0]?.image_url}
            alt={card.name}
          />
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className={`alt-img-thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <Image
                    src={img.image_url_small}
                    alt={`Art ${i + 1}`}
                    width={52}
                    height={76}
                    className="block"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="animate-fade-up-2 flex-1 min-w-[280px] flex flex-col">
          {/* Attribute + type badges */}
          <div className="flex gap-2 flex-wrap mb-3.5">
            {card.attribute && (
              <span
                className="inline-flex items-center px-3 py-[3px] rounded-full font-cinzel text-[0.58rem] tracking-[0.12em] uppercase"
                style={{
                  background: aStyle.bg,
                  border: `1px solid ${aStyle.border}`,
                  color: aStyle.text,
                }}
              >
                {card.attribute}
              </span>
            )}
            <span
              className="inline-flex items-center px-3 py-[3px] rounded-full font-cinzel text-[0.58rem] tracking-[0.12em] uppercase"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,224,204,0.5)",
              }}
            >
              {card.type}
            </span>
          </div>

          {/* Card name — gradient shimmer (must stay inline for bg-clip text) */}
          <h1
            className="font-cinzel font-black leading-tight mb-1.5 animate-shimmer"
            style={{
              fontSize: "clamp(1.4rem,3vw,2.2rem)",
              letterSpacing: "0.06em",
              color: "transparent",
              background:
                "linear-gradient(135deg,#9a7b1a 0%,#d4af37 30%,#f5e17a 55%,#d4af37 80%,#9a7b1a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {card.name}
          </h1>

          {/* Race · Archetype */}
          <p
            className="font-crimson italic text-[0.9rem] tracking-[0.04em] mb-5"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
            {[card.race, card.archetype].filter(Boolean).join(" · ")}
          </p>

          {/* Stat pills */}
          {(hasATK || hasDEF || hasLevel || hasLink) && (
            <div className="flex gap-2.5 flex-wrap mb-5">
              {hasLevel && (
                <StatPill
                  label="Level"
                  value={Array.from({ length: card.level }, () => "★").join("")}
                />
              )}
              {hasLink && <StatPill label="Link" value={card.linkval} />}
              {hasATK && (
                <StatPill
                  label="ATK"
                  value={card.atk === -1 ? "?" : card.atk}
                />
              )}
              {hasDEF && (
                <StatPill
                  label="DEF"
                  value={card.def === -1 ? "?" : card.def}
                />
              )}
              {card.scale !== undefined && (
                <StatPill label="Scale" value={card.scale} />
              )}
            </div>
          )}

          {/* Stats grid */}
          <div
            className="pt-1"
            style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
          >
            <StatRow
              label="Attribute"
              value={card.attribute}
              accent={aStyle.text}
            />
            <StatRow label="Race" value={card.race} />
            <StatRow
              label="Type"
              value={card.typeline?.join(" / ") ?? card.type}
            />
            <StatRow label="Archetype" value={card.archetype} />
            <StatRow label="Format" value={card.format} />
          </div>

          {/* Link markers */}
          {card.linkmarkers?.length > 0 && (
            <div className="mt-3.5">
              <span
                className="font-cinzel text-[0.58rem] tracking-[0.14em] uppercase block mb-2"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                Link Markers
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {card.linkmarkers.map((m) => (
                  <span
                    key={m}
                    className="font-crimson text-[0.75rem] px-[9px] py-[3px] rounded-[3px]"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      border: "1px solid rgba(212,175,55,0.3)",
                      color: "#d4af37",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ban list */}
          {card.banlist_info && (
            <div className="mt-3.5 flex gap-2 flex-wrap">
              {Object.entries(card.banlist_info).map(([format, status]) => {
                const statusColors = {
                  Banned: "rgba(220,50,50,0.7)",
                  Limited: "rgba(220,120,0,0.7)",
                  "Semi-Limited": "rgba(200,180,0,0.7)",
                };
                const col = statusColors[status] || "rgba(212,175,55,0.5)";
                return (
                  <span
                    key={format}
                    className="font-cinzel text-[0.55rem] tracking-[0.1em] uppercase px-2.5 py-[3px] rounded-full"
                    style={{
                      background: col.replace("0.7", "0.12"),
                      border: `1px solid ${col}`,
                      color: col,
                    }}
                  >
                    {format.replace("ban_", "").replace("_", " ")}: {status}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Card text ── */}
      <div className="animate-fade-up-3 mt-9">
        <SectionHeading>Card Text</SectionHeading>
        <div
          className="animate-desc rounded-md px-6 py-5"
          style={{
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <p
            className="font-crimson text-[1rem] leading-[1.75] m-0 whitespace-pre-wrap tracking-[0.02em]"
            style={{ color: "rgba(232,224,204,0.85)" }}
          >
            {card.desc}
          </p>
        </div>
      </div>

      {/* ── Market prices ── */}
      {hasPrices && (
        <div>
          <SectionHeading>Market Prices</SectionHeading>
          <div className="flex gap-2.5 flex-wrap">
            {priceEntries.map(
              (p) =>
                p.value && (
                  <PriceCell key={p.label} label={p.label} value={p.value} />
                ),
            )}
          </div>
        </div>
      )}

      {/* ── Card sets ── */}
      {sets.length > 0 && (
        <div>
          <SectionHeading>Card Sets ({sets.length})</SectionHeading>
          <div className="flex gap-2 flex-wrap">
            {sets.map((s, i) => (
              <SetBadge key={i} set={s} />
            ))}
          </div>
        </div>
      )}

      {/* ── Alternate artwork ── */}
      {images.length > 1 && (
        <div>
          <SectionHeading>Alternate Artwork</SectionHeading>
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <div
                key={img.id}
                onClick={() => setActiveImg(i)}
                className={`alt-img-thumb rounded-md ${
                  i === activeImg ? "active" : ""
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={`Art variant ${i + 1}`}
                  width={120}
                  height={175}
                  className="block rounded-[5px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
