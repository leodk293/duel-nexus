"use client";
import { useSession } from "next-auth/react";
import {
  card_type,
  yugioh_races,
  yugioh_attributes,
  yugioh_levels,
} from "../../utils/card_details";
import { loadPageState, savePageState } from "../../utils/pageStateStorage";
import { nanoid } from "nanoid";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SkeletonCard from "../../components/Skeleton";
import HoloCard from "../../components/HoloCard";
import GoldSelect from "../../components/GoldSelect";

const PAGE_SIZE = 20;
const API_BASE = "https://duel-nexus-api.vercel.app/api/duel-links";

function buildApiUrl({ search, type, race, attribute, level, archetype }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (type) params.set("type", type);
  if (race) params.set("race", race);
  if (attribute) params.set("attribute", attribute);
  if (level) params.set("level", level);
  if (archetype) params.set("archetype", archetype);
  const qs = params.toString();
  return qs ? `${API_BASE}?${qs}` : API_BASE;
}

function FilterBadge({ label, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        background: "rgba(212,175,55,0.1)",
        border: "1px solid rgba(212,175,55,0.35)",
        borderRadius: "999px",
        fontSize: "0.63rem",
        fontFamily: "'Cinzel', serif",
        color: "#d4af37",
        letterSpacing: "0.04em",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "rgba(212,175,55,0.6)",
          cursor: "pointer",
          padding: 0,
          fontSize: "0.85rem",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </span>
  );
}

function DuelLinksContent() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? null;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchedCard, setSearchedCard] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardRace, setCardRace] = useState("");
  const [cardAttribute, setCardAttribute] = useState("");
  const [cardLevel, setCardLevel] = useState("");
  const [cardArchetype, setCardArchetype] = useState("");
  const [archetypes, setArchetypes] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [visibleEnd, setVisibleEnd] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const u = (k) => searchParams.get(k) ?? "";
    const hasUrl = [
      "search",
      "type",
      "race",
      "attribute",
      "level",
      "archetype",
    ].some((k) => searchParams.get(k));
    if (hasUrl) {
      setSearchedCard(u("search"));
      setCardType(u("type"));
      setCardRace(u("race"));
      setCardAttribute(u("attribute"));
      setCardLevel(u("level"));
      setCardArchetype(u("archetype"));
      setVisibleEnd(PAGE_SIZE);
    } else {
      const s = loadPageState(userId);
      if (s) {
        setSearchedCard(s.search ?? "");
        setCardType(s.type ?? "");
        setCardRace(s.race ?? "");
        setCardAttribute(s.attribute ?? "");
        setCardLevel(s.level ?? "");
        setCardArchetype(s.archetype ?? "");
        setVisibleEnd(
          typeof s.visibleEnd === "number" && s.visibleEnd >= PAGE_SIZE
            ? s.visibleEnd
            : PAGE_SIZE,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    fetch("https://db.ygoprodeck.com/api/v7/archetypes.php")
      .then((r) => r.json())
      .then(setArchetypes)
      .catch(console.error);
  }, []);

  const currentFilters = {
    search: searchedCard,
    type: cardType,
    race: cardRace,
    attribute: cardAttribute,
    level: cardLevel,
    archetype: cardArchetype,
  };

  useEffect(() => {
    savePageState(userId, {
      ...currentFilters,
      visibleEnd,
    });
    const p = new URLSearchParams();
    Object.entries(currentFilters).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    router.replace(p.toString() ? `?${p}` : "?", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchedCard,
    cardType,
    cardRace,
    cardAttribute,
    cardLevel,
    cardArchetype,
    visibleEnd,
  ]);

  const fetchCards = useCallback(async (filters) => {
    setLoading(true);
    setError(false);
    setAllCards([]);
    setVisibleEnd(PAGE_SIZE);
    try {
      const res = await fetch(buildApiUrl(filters));
      if (!res.ok) throw new Error();
      const json = await res.json();
      setAllCards(json.cards ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => fetchCards(currentFilters),
      searchedCard ? 400 : 0,
    );
    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchedCard,
    cardType,
    cardRace,
    cardAttribute,
    cardLevel,
    cardArchetype,
  ]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) setVisibleEnd((p) => p + PAGE_SIZE);
      },
      { rootMargin: "300px" },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [allCards]);

  function resetFilters() {
    setSearchedCard("");
    setCardType("");
    setCardRace("");
    setCardAttribute("");
    setCardLevel("");
    setCardArchetype("");
  }

  const visibleCards = allCards.slice(0, visibleEnd);
  const hasMore = visibleEnd < allCards.length;
  const activeFilters = Object.entries(currentFilters).filter(([, v]) => v);

  return (
    <>
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
            Duel links Card Database
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
            Duel Links
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
            Summon your knowledge. Command every card.
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
                onChange={(e) => setSearchedCard(e.target.value)}
                value={searchedCard}
                type="text"
                placeholder="Search card name…"
              />
            </div>
            <GoldSelect
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            >
              <option value="">Type</option>
              {card_type.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.name}
                </option>
              ))}
            </GoldSelect>
            <GoldSelect
              value={cardRace}
              onChange={(e) => setCardRace(e.target.value)}
            >
              <option value="">Race</option>
              {yugioh_races.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.name}
                </option>
              ))}
            </GoldSelect>
            <GoldSelect
              value={cardAttribute}
              onChange={(e) => setCardAttribute(e.target.value)}
            >
              <option value="">Attribute</option>
              {yugioh_attributes.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </GoldSelect>
            <GoldSelect
              value={cardLevel}
              onChange={(e) => setCardLevel(e.target.value)}
            >
              <option value="">Level</option>
              {yugioh_levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </GoldSelect>

            <div
              style={{
                position: "relative",
                flexGrow: 1,
                minWidth: "120px",
                maxWidth: "240px",
              }}
            >
              <input
                className="search-input"
                onChange={(e) => setCardArchetype(e.target.value)}
                value={cardArchetype}
                type="text"
                placeholder="Search archetype name…"
                list="archetype-list"
              />
              <datalist id="archetype-list">
                {archetypes.map((archetype) => (
                  <option key={nanoid(10)} value={archetype.archetype_name} />
                ))}
              </datalist>
            </div>
          </form>

          {activeFilters.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "14px",
                justifyContent: "center",
              }}
            >
              {activeFilters.map(([key, val]) => (
                <FilterBadge
                  key={key}
                  label={`${key}: ${val}`}
                  onRemove={() => {
                    const s = {
                      search: setSearchedCard,
                      type: setCardType,
                      race: setCardRace,
                      attribute: setCardAttribute,
                      level: setCardLevel,
                      archetype: setCardArchetype,
                    };
                    s[key]?.("");
                  }}
                />
              ))}
              <button
                onClick={resetFilters}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "999px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.63rem",
                  fontFamily: "'Cinzel',serif",
                  letterSpacing: "0.05em",
                  padding: "3px 12px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(255,80,80,0.45)";
                  e.target.style.color = "rgba(255,110,110,0.75)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.color = "rgba(255,255,255,0.3)";
                }}
              >
                Clear all
              </button>
            </div>
          )}
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
          {!loading && !error && allCards.length > 0 && (
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
                {allCards.length} cards
              </span>
            </div>
          )}

          {error ? (
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
                onClick={() => fetchCards(currentFilters)}
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
          ) : loading ? (
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
          ) : allCards.length === 0 ? (
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
              No cards answered the call.
              <br />
              <span
                style={{
                  fontSize: "0.68rem",
                  opacity: 0.5,
                  fontFamily: "'Crimson Pro',serif",
                  fontStyle: "italic",
                }}
              >
                Adjust your filters and try again.
              </span>
            </div>
          ) : (
            <>
              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                {visibleCards.map((card, i) => (
                  <div
                    key={card.id ?? nanoid(8)}
                    className="card-enter"
                    style={{
                      animationDelay: `${Math.min(i % PAGE_SIZE, 14) * 0.035}s`,
                    }}
                  >
                    <HoloCard card={card} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    padding: "36px 0",
                  }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "var(--gold)",
                        animation: `dotPulse 1.3s ease-in-out ${delay}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}

              {!hasMore && allCards.length > PAGE_SIZE && (
                <p className="end-tag">
                  ✦ All {allCards.length} cards summoned ✦
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default function DuelLinks() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cinzel', serif",
            color: "var(--gold)",
          }}
        >
          Loading…
        </div>
      }
    >
      <DuelLinksContent />
    </Suspense>
  );
}
