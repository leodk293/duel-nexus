'use client';
export default function GoldSelect({ value, onChange, children }) {
  const isActive = Boolean(value);
  return (
    <div style={{ position: "relative", minWidth: "148px" }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          appearance: "none",
          background: isActive
            ? "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))"
            : "rgba(255,255,255,0.04)",
          border: isActive
            ? "1px solid rgba(212,175,55,0.65)"
            : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          color: isActive ? "#d4af37" : "rgba(232,224,204,0.55)",
          padding: "10px 36px 10px 14px",
          fontSize: "0.73rem",
          fontFamily: "'Cinzel', serif",
          letterSpacing: "0.05em",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: isActive ? "0 0 14px rgba(212,175,55,0.18)" : "none",
        }}
      >
        {children}
      </select>
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: isActive ? "#d4af37" : "rgba(255,255,255,0.25)",
          fontSize: "0.55rem",
        }}
      >
        ▼
      </div>
    </div>
  );
}
