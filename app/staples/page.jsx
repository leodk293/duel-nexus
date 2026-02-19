"use client";
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import SkeletonCard from "../../components/Skeleton";
import HoloCard from "../../components/HoloCard";
import GoldSelect from "../../components/GoldSelect";

const cardType = [
  { name: "Monster", value: "Effect Monster" },
  { name: "Spell", value: "Spell Card" },
  { name: "Trap", value: "Trap Card" },
];

function matchesFilter(card, name, type) {
  const nameMatch =
    !name.trim() || card.name.toLowerCase().includes(name.trim().toLowerCase());
  if (!nameMatch) return false;
  if (!type) return true;
  if (type === "Effect Monster")
    return card.type && card.type.includes("Monster");
  return card.type === type;
}

export default function Staples() {
  const [staples, setStaples] = useState({
    error: false,
    loading: true,
    data: [],
  });

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  async function fetchStaples() {
    setStaples((prev) => ({ ...prev, error: false, loading: true, data: [] }));
    try {
      const res = await fetch(
        "https://db.ygoprodeck.com/api/v7/cardinfo.php?staple=yes",
      );
      if (!res.ok) throw new Error("An error has occurred");
      const result = await res.json();
      setStaples({
        error: false,
        loading: false,
        data: result.data || [],
      });
    } catch (error) {
      setStaples({
        error: true,
        loading: false,
        data: [],
      });
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchStaples();
  }, []);

  const filtered = (staples.data || []).filter((card) =>
    matchesFilter(card, name, type),
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--obsidian)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-240px",
          left: "50%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.065) 0%, transparent 65%)",
          animation: "orbDrift 9s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          right: "-350px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(60,30,160,0.055) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          width: "100%",
          padding: "52px 24px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "80px",
            height: "1px",
            marginBottom: "22px",
            background:
              "linear-gradient(to right, transparent, var(--gold), transparent)",
          }}
        />
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            letterSpacing: "0.32em",
            color: "rgba(212,175,55,0.55)",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Staple Cards
        </p>
        <h1
          style={{
            fontFamily: "'Cinzel',serif",
            fontWeight: 900,
            fontSize: "clamp(2rem,5vw,3.8rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "transparent",
            background:
              "linear-gradient(135deg,#9a7b1a 0%,#d4af37 25%,#f5e17a 50%,#d4af37 75%,#9a7b1a 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation:
              "shimmer 5s linear infinite, titleGlow 3s ease-in-out infinite",
            marginBottom: "10px",
          }}
        >
          Staples
        </h1>
        <p
          style={{
            fontFamily: "'Crimson Pro',serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "rgba(232,224,204,0.38)",
            letterSpacing: "0.07em",
            marginBottom: "36px",
          }}
        >
          Essential cards for every duelist.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "820px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right,transparent,rgba(212,175,55,0.25))",
            }}
          />
          <span
            style={{
              color: "rgba(212,175,55,0.45)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
            }}
          >
            ✦ ✦ ✦
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to left,transparent,rgba(212,175,55,0.25))",
            }}
          />
        </div>
      </header>

      {/* Filters */}
      <section
        style={{
          width: "100%",
          maxWidth: "920px",
          padding: "32px 20px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              flexGrow: 1,
              minWidth: "220px",
              maxWidth: "340px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "13px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(212,175,55,0.38)",
                fontSize: "0.75rem",
                pointerEvents: "none",
              }}
            >
              ⚔
            </span>
            <input
              className="search-input"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Search staple name…"
            />
          </div>
          <GoldSelect value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Type</option>
            {cardType.map((t) => (
              <option key={nanoid(10)} value={t.value}>
                {t.name}
              </option>
            ))}
          </GoldSelect>
        </form>
      </section>

      {/* Results */}
      <main
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "0 16px",
          zIndex: 1,
          position: "relative",
        }}
      >
        {!staples.loading && !staples.error && filtered.length > 0 && (
          <div className="section-rule">
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.62rem",
                color: "var(--text-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} staples
            </span>
          </div>
        )}

        {staples.error ? (
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              color: "rgba(212,175,55,0.5)",
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>⚠</div>
            A dark force interrupted the summon.
            <br />
            <button
              onClick={fetchStaples}
              style={{
                marginTop: "18px",
                background: "none",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#d4af37",
                fontFamily: "'Cinzel',serif",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                padding: "9px 22px",
                cursor: "pointer",
                borderRadius: "3px",
                transition: "all 0.2s",
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
        ) : staples.loading ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              color: "rgba(212,175,55,0.45)",
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>🔮</div>
            No staples match your filters.
            <br />
            <span
              style={{
                fontSize: "0.68rem",
                opacity: 0.5,
                fontFamily: "'Crimson Pro',serif",
                fontStyle: "italic",
              }}
            >
              Adjust search or type and try again.
            </span>
          </div>
        ) : (
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {filtered.map((staple, i) => {
              const card = {
                id: staple.id,
                name: staple.name,
                image:
                  staple.card_images?.[0]?.image_url ||
                  "https://images.ygoprodeck.com/images/cards/0.jpg",
              };
              return (
                <div
                  key={staple.id ?? nanoid(8)}
                  className="card-enter"
                  style={{
                    animationDelay: `${Math.min(i % 20, 14) * 0.035}s`,
                  }}
                >
                  <HoloCard card={card} />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
