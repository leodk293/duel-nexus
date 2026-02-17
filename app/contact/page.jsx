"use client";
import React from "react";

export default function Contact() {
  const [result, setResult] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully!");
        event.target.reset();
        setTimeout(() => setResult(""), 5000);
      } else {
        console.error("Error", data);
        setResult(data.message || "Failed to send. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setResult("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
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
        @keyframes successPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes spinOrb {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .fade-in   { animation: fadeUp 0.5s ease both; }
        .fade-in-2 { animation: fadeUp 0.5s 0.1s ease both; }

        /* Form input styles */
        .form-input, .form-textarea {
          appearance: none;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 6px;
          color: #e8e0cc;
          padding: 14px 18px;
          font-size: 0.95rem;
          font-family: 'Crimson Pro', serif;
          letter-spacing: 0.03em;
          outline: none;
          transition: all 0.25s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: rgba(232,224,204,0.25);
        }
        .form-input:focus, .form-textarea:focus {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.12);
        }
        .form-textarea {
          min-height: 160px;
          resize: vertical;
          font-family: 'Crimson Pro', serif;
        }

        /* Submit button states */
        .submit-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212,175,55,0.25);
        }
        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .submit-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        .submit-btn:hover:not(:disabled)::before {
          transform: translateX(100%);
        }
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
            background:
              "radial-gradient(circle, rgba(212,175,55,0.065) 0%, transparent 65%)",
            animation: "orbFloat 9s ease-in-out infinite",
          }}
        />
        <div
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            bottom: "-150px",
            right: "-200px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(60,30,160,0.045) 0%, transparent 65%)",
          }}
        />

        {/* ── Header ── */}
        <header className="w-full pt-12 px-6 flex flex-col items-center relative z-10">
          {/* Top rule */}
          <div
            className="w-[120px] h-px mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, #d4af37, transparent)",
            }}
          />

          {/* Eyebrow */}
          <p
            className="font-cinzel text-[0.6rem] tracking-[0.3em] uppercase mb-2.5"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Reach Out
          </p>

          {/* Title */}
          <h1
            className="font-cinzel font-black text-[clamp(2rem,5vw,3.6rem)] tracking-[0.12em] uppercase mb-2"
            style={{
              color: "transparent",
              background:
                "linear-gradient(135deg, #d4af37 0%, #f5e27a 40%, #d4af37 60%, #9a7b1a 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation:
                "shimmer 4s linear infinite, titleGlow 3s ease-in-out infinite",
            }}
          >
            Contact
          </h1>

          {/* Subtitle */}
          <p
            className="font-crimson italic text-[0.95rem] mb-8 tracking-[0.08em] text-center max-w-[500px]"
            style={{ color: "rgba(232,224,204,0.4)" }}
          >
            Send your message through the aether. We'll respond when the stars
            align.
          </p>

          {/* Bottom rule */}
          <div className="flex items-center gap-3 w-full max-w-[860px]">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,175,55,0.3))",
              }}
            />
            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "0.7rem" }}>
              ✦
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(212,175,55,0.3))",
              }}
            />
          </div>
        </header>

        {/* ── Form container ── */}
        <main className="w-full max-w-[600px] px-6 pt-10 relative z-10">
          <form
            onSubmit={onSubmit}
            className="fade-in rounded-lg px-8 py-10"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(212,175,55,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Name field */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block font-cinzel text-[0.65rem] tracking-[0.16em] uppercase mb-2.5"
                style={{ color: "rgba(212,175,55,0.65)" }}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="form-input"
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>

            {/* Email field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block font-cinzel text-[0.65rem] tracking-[0.16em] uppercase mb-2.5"
                style={{ color: "rgba(212,175,55,0.65)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="form-input"
                placeholder="your.email@domain.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Message field */}
            <div className="mb-8">
              <label
                htmlFor="message"
                className="block font-cinzel text-[0.65rem] tracking-[0.16em] uppercase mb-2.5"
                style={{ color: "rgba(212,175,55,0.65)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="form-textarea"
                placeholder="Share your thoughts, questions, or feedback..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn w-full font-cinzel text-[0.75rem] tracking-[0.14em] uppercase px-8 py-4 rounded-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.12))",
                border: "1px solid rgba(212,175,55,0.5)",
                color: "#d4af37",
                boxShadow: "0 4px 16px rgba(212,175,55,0.15)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{
                      border: "2px solid rgba(212,175,55,0.3)",
                      borderTopColor: "#d4af37",
                      animation: "spinOrb 0.8s linear infinite",
                    }}
                  />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>

            {/* Result message */}
            {result && (
              <div
                className="mt-6 text-center font-crimson text-[0.9rem] px-4 py-3 rounded-md"
                style={{
                  background: result.includes("success")
                    ? "rgba(120,220,120,0.08)"
                    : result.includes("Sending")
                      ? "rgba(212,175,55,0.08)"
                      : "rgba(220,80,80,0.08)",
                  border: result.includes("success")
                    ? "1px solid rgba(120,220,120,0.3)"
                    : result.includes("Sending")
                      ? "1px solid rgba(212,175,55,0.3)"
                      : "1px solid rgba(220,80,80,0.3)",
                  color: result.includes("success")
                    ? "rgba(160,255,160,0.9)"
                    : result.includes("Sending")
                      ? "#d4af37"
                      : "rgba(255,120,120,0.9)",
                  animation: result.includes("success")
                    ? "successPulse 2s ease-in-out infinite"
                    : "none",
                }}
              >
                {result}
              </div>
            )}
          </form>

          {/* Additional contact info (optional decorative element) */}
          <div className="fade-in-2 mt-8 text-center">
            <p
              className="font-crimson italic text-[0.8rem] tracking-[0.04em]"
              style={{ color: "rgba(232,224,204,0.3)" }}
            >
              Alternatively, reach us directly at{" "}
              <a
                href="mailto:contact@duelnexus.com"
                className="font-cinzel tracking-[0.06em] transition-colors duration-200"
                style={{ color: "rgba(212,175,55,0.6)" }}
                onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(212,175,55,0.6)")
                }
              >
                contact@duelnexus.com
              </a>
            </p>
          </div>

          {/* End ornament */}
          <div className="flex items-center gap-3 mt-12 mb-8">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,175,55,0.2))",
              }}
            />
            <span
              className="font-cinzel text-[0.55rem] tracking-[0.2em] uppercase"
              style={{ color: "rgba(212,175,55,0.35)" }}
            >
              ✦ Duel Nexus ✦
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(212,175,55,0.2))",
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
}
