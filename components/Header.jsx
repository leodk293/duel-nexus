"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import googleLogo from "../public/google-logo.png";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";
import { clearPageState } from "../utils/pageStateStorage";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status, data: session } = useSession();

  //const navLinks = ["Cards", "Staples", "Decks", "Duels", "Community"];
  const navLinks = [
    {
      name: "Cards",
      link: "/",
    },
    {
      name: "Staples",
      link: "/staples",
    },
    {
      name: "Banlist",
      link: "/banlist",
    },
    // {
    //   name: "Decks",
    //   link: "/decks",
    // },
    {
      name: "Contact",
      link: "/contact",
    },

    {
      name: "Duels",
      link: "/duels",
    },
    {
      name: "Community",
      link: "/community",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .ygo-shimmer { animation: shimmer 5s infinite linear; }
        .ygo-glow-line { animation: glow-pulse 3s ease-in-out infinite; }
        .ygo-nav-link:hover {
          color: #FFD700;
          text-shadow: 0 0 12px rgba(255,215,0,0.7);
          background: rgba(255,215,0,0.06);
        }
        .ygo-cta:hover {
          box-shadow: 0 0 24px rgba(255,215,0,0.6), 0 0 48px rgba(255,165,0,0.3);
          transform: translateY(-1px);
        }
        .ygo-mobile-link:hover { color: #FFD700; }
      `}</style>

      <header
        className="sticky top-0 z-50 overflow-hidden font-sans"
        style={{
          background:
            "linear-gradient(135deg, #08081a 0%, #180828 45%, #0b1830 100%)",
          borderBottom: "1px solid rgba(255,215,0,0.2)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.7)",
        }}
      >
        {/* Shimmer */}
        <div
          className="ygo-shimmer absolute top-0 h-full w-1/2 pointer-events-none"
          style={{
            left: "-100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,215,0,0.05), transparent)",
          }}
        />

        {/* Top accent line */}
        <div
          className="ygo-glow-line absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent)",
          }}
        />

        {/* Main row */}
        <div className="max-w-6xl mx-auto px-5 h-[68px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-3 cursor-pointer flex-shrink-0">
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={nanoid(10)}
                href={`${link.link}`}
                className="ygo-nav-link inline-block px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-md transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {status === "loading" && (
              <div
                className="w-24 h-8 rounded-lg animate-pulse"
                style={{ background: "rgba(255,215,0,0.1)" }}
              />
            )}

            {status === "unauthenticated" && (
              <button
                onClick={() => signIn("google")}
                className="ygo-cta flex flex-row gap-1 justify-center items-center px-5 py-2 rounded-lg text-[13px] font-extrabold tracking-wide transition-all duration-200 text-[#0a0a1a]"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  boxShadow: "0 0 12px rgba(255,215,0,0.35)",
                }}
              >
                <Image
                  src={googleLogo}
                  alt="GOOGLE LOGO"
                  width={20}
                  height={20}
                  className=" object-cover"
                />
                <p>Login</p>
              </button>
            )}

            {status === "authenticated" && (
              <>
                {/* User pill */}
                <div
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full"
                  style={{
                    border: "1px solid rgba(255,215,0,0.25)",
                    background: "rgba(255,215,0,0.05)",
                  }}
                >
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    className="rounded-full object-cover flex-shrink-0"
                    width={24}
                    height={24}
                  />
                  <span className="text-white text-[13px] font-light whitespace-nowrap">
                    {session?.user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const userId =
                      session?.user?.id ?? session?.user?.email ?? null;
                    clearPageState(userId);
                    signOut();
                  }}
                  className="ygo-cta px-5 py-2 rounded-lg text-[13px] font-extrabold tracking-wide transition-all duration-200 text-[#0a0a1a]"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    boxShadow: "0 0 12px rgba(255,215,0,0.35)",
                  }}
                >
                  ⚡ Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile right side: avatar (if authed) + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {status === "authenticated" && (
              <Image
                src={session?.user?.image}
                alt={session?.user?.name}
                className="rounded-full object-cover"
                width={32}
                height={32}
                style={{ border: "1px solid rgba(255,215,0,0.35)" }}
              />
            )}
            <button
              className="flex flex-col justify-center gap-[5px] w-10 h-10 rounded-lg cursor-pointer px-[9px]"
              style={{
                background: "rgba(255,215,0,0.07)",
                border: "1px solid rgba(255,215,0,0.25)",
              }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {[
                {
                  transform: menuOpen
                    ? "rotate(45deg) translate(5px, 5px)"
                    : "none",
                  opacity: 1,
                },
                { transform: "none", opacity: menuOpen ? 0 : 1 },
                {
                  transform: menuOpen
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none",
                  opacity: 1,
                },
              ].map((line, i) => (
                <span
                  key={i}
                  className="block h-0.5 w-full rounded-sm"
                  style={{
                    background: "#FFD700",
                    transform: line.transform,
                    opacity: line.opacity,
                    transition: "transform 0.3s, opacity 0.3s",
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className="md:hidden flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: menuOpen ? "500px" : "0",
            opacity: menuOpen ? 1 : 0,
            padding: menuOpen ? "8px 20px 20px" : "0 20px",
            borderTop: menuOpen
              ? "1px solid rgba(255,215,0,0.1)"
              : "1px solid transparent",
          }}
        >
          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={nanoid(10)}
              href={`${link.link}`}
              className="ygo-mobile-link py-3 text-sm font-medium tracking-wide transition-colors duration-200"
              style={{
                color: "rgba(255,255,255,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile auth section */}
          <div className="mt-4">
            {status === "authenticated" ? (
              <div className="flex flex-col gap-3">
                {/* User info row */}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(255,215,0,0.05)",
                    border: "1px solid rgba(255,215,0,0.15)",
                  }}
                >
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    className="rounded-full object-cover flex-shrink-0"
                    width={36}
                    height={36}
                    style={{ border: "1px solid rgba(255,215,0,0.3)" }}
                  />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {session?.user?.name?.split(" ")[0]}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(255,215,0,0.5)" }}
                    >
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const userId =
                      session?.user?.id ?? session?.user?.email ?? null;
                    clearPageState(userId);
                    signOut();
                  }}
                  className="w-full py-3 rounded-lg text-sm font-extrabold tracking-wide text-[#0a0a1a]"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    boxShadow: "0 0 12px rgba(255,215,0,0.35)",
                  }}
                >
                  ⚡ Logout
                </button>
              </div>
            ) : status === "unauthenticated" ? (
              <button
                onClick={() => signIn("google")}
                className="w-full flex flex-row gap-1 justify-center items-center py-3 rounded-lg text-sm font-extrabold tracking-wide text-[#0a0a1a]"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  boxShadow: "0 0 12px rgba(255,215,0,0.35)",
                }}
              >
                <Image
                  src={googleLogo}
                  alt="GOOGLE LOGO"
                  width={20}
                  height={20}
                  className=" object-cover"
                />
                <p>Login</p>
              </button>
            ) : (
              <div
                className="w-full h-11 rounded-lg animate-pulse"
                style={{ background: "rgba(255,215,0,0.08)" }}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
