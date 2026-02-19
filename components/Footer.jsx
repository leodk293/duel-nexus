"use client";
import React from "react";
import Link from "next/link";
import { nanoid } from "nanoid";

const footerLinks = {
  Explore: [
    {
      name: "All Cards",
      value: "/",
    },
    {
      name: "Banned List",
      value: "/banlist",
    },
    {
      name: "Card Search",
      value: "/",
    },
  ],
  Gameplay: [
    {
      name: "How to Duel",
      value: "https://www.yugioh-card.com/eu/forbeginners",
    },
    {
      name: "Deck Building",
      value: "https://www.yugioh-card.com/eu/forbeginners",
    },
    {
      name: "Tournaments",
      value: "https://www.yugioh-card.com/en/events",
    },
    {
      name: "Rulebook",
      value: "https://www.yugioh-card.com/eu/play/speed-duel-rulebook",
    },
    {
      name: "Formats",
      value: "https://formatlibrary.com/formats",
    },
  ],
  Community: [
    {
      name: "Forums",
      value: "https://yugioh.fandom.com/wiki/Forum:Yu-Gi-Oh!_Deck_Help",
    },
    {
      name: "Discord",
      value: "/",
    },
    {
      name: "Card Market",
      value: "https://www.cardmarket.com/en/YuGiOh",
    },
    {
      name: "Fan Art",
      value: "https://www.pinterest.com/dipperallen/yu-gi-oh-fan-art",
    },
  ],
  Support: [
    {
      name: "FAQ",
      value: "/faq",
    },
    {
      name: "Contact Us",
      value: "/contact",
    },
    {
      name: "Report a Bug",
      value: "/contact",
    },
    {
      name: "Accessibility",
      value: "/",
    },
    {
      name: "Privacy Policy",
      value: "/",
    },
  ],
};

const socials = [
  {
    label: "Twitter/X",
    link: "https://x.com/Aboubac48530295",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    link: "https://www.youtube.com/@aboubacartraore5831",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    link: "https://www.reddit.com/r/yugioh/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #08081a 0%, #0d0d20 60%, #060610 100%)",
        borderTop: "1px solid rgba(255,215,0,0.15)",
      }}
    >
      {/* Top gold accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent)",
        }}
      />

      {/* Subtle bg triangle decoration */}
      <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none select-none">
        <svg width="420" height="360" viewBox="0 0 36 36" fill="none">
          <polygon points="18,1 35,35 1,35" fill="#FFD700" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 opacity-[0.025] pointer-events-none select-none">
        <svg width="280" height="240" viewBox="0 0 36 36" fill="none">
          <polygon points="18,1 35,35 1,35" fill="#FFD700" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-14 pb-8">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-12">
          {/* Brand column */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-[46px] h-[46px] rounded-[10px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.06))",
                  border: "1px solid rgba(255,215,0,0.35)",
                  boxShadow: "0 0 14px rgba(255,215,0,0.15)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <polygon
                    points="18,3 33,30 3,30"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="18,10 26,26 10,26"
                    fill="rgba(255,215,0,0.08)"
                    stroke="rgba(255,215,0,0.4)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="18"
                    cy="20"
                    r="4.5"
                    fill="#FFD700"
                    opacity="0.9"
                  />
                  <circle cx="18" cy="20" r="2.5" fill="#FFA500" />
                </svg>
              </div>
              <div>
                {/* <span
                  className="block text-[17px] font-black tracking-[2.5px]"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >YU-GI-OH!</span>
                <span className="block text-[8.5px] font-semibold tracking-[3px]" style={{ color: 'rgba(255,215,0,0.5)' }}>
                  CARD UNIVERSE
                </span> */}
                <span
                  className="block text-[17px] font-black tracking-[2.5px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DUEL NEXUS
                </span>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              The ultimate hub for duelists worldwide. Browse cards, build
              decks, and rise to the top of the leaderboard.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ label, icon, link }) => (
                <Link
                  key={label}
                  href={`${link}`}
                  target="_blank"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(255,215,0,0.07)",
                    border: "1px solid rgba(255,215,0,0.15)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,215,0,0.15)";
                    e.currentTarget.style.borderColor = "rgba(255,215,0,0.4)";
                    e.currentTarget.style.color = "#FFD700";
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(255,215,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,215,0,0.07)";
                    e.currentTarget.style.borderColor = "rgba(255,215,0,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  className="text-xs font-bold tracking-[2.5px] uppercase mb-4"
                  style={{ color: "#FFD700" }}
                >
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={nanoid(10)}>
                      <Link
                        href={`${link.value}`}
                        target={`${link.value[0] !== "/" ? "_blank" : ""}`}
                        className="text-sm transition-colors duration-150"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "rgba(255,215,0,0.85)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.45)";
                        }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: "rgba(255,215,0,0.08)" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 Yu-Gi-Oh! Card Universe. Fan project — not affiliated with
            Konami.
          </p>
          <div className="flex items-center gap-5">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,215,0,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
