"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { candidates } from "../data/candidates";

function getNameById(id: number | null) {
  if (!id) return null;
  return candidates.find((c) => c.id === id)?.name ?? null;
}

export default function ResultClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const winnerId = Number(sp.get("winnerId"));

  // 예) /result?winnerId=1&secondId=2&semiIds=3,4
  const secondId = sp.get("secondId") ? Number(sp.get("secondId")) : null;
  const semiIds = useMemo(() => {
    const raw = sp.get("semiIds"); // "3,4"
    if (!raw) return [];
    return raw
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => Number.isFinite(n));
  }, [sp]);

  const winner = useMemo(() => {
    return candidates.find((c) => c.id === winnerId) ?? null;
  }, [winnerId]);

  const secondName = useMemo(() => getNameById(secondId), [secondId]);
  const semiNames = useMemo(
    () => semiIds.map((id) => getNameById(id)).filter(Boolean) as string[],
    [semiIds]
  );

  if (!winner) {
    return (
      <main style={pageStyle}>
        <div style={{ width: "100%", maxWidth: 720, textAlign: "center" }}>
          <p style={{ fontFamily: "Rimgul", margin: 0 }}>ERROR!</p>

          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: 12,
              width: "100%",
              border: 0,
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="/main/btn_restart.png"
              alt="HOME"
              style={{ width: "min(200px, 78%)", height: "auto", display: "block" }}
            />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      {/* ✅ result 타이틀 이미지 */}
      <img
        src="/main/result.png"
        alt="RESULT"
        style={{
          width: "min(180px, 50vw)",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />

      {/* ✅ Winner Card: play처럼 한 박스에 (최종1위 + 제목 + 영상) */}
      <div style={winnerCardStyle}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>최종 1위</div>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 400 }}>{winner.name}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={winner.video}
              title={winner.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      </div>

      {/* ✅ 2위 + 4강진출 표 */}
      <div style={{ marginTop: 14 }}>
        <div style={tableWrapStyle}>
          <div style={tableRowStyle}>
            <div style={tableKeyStyle}>2위</div>
            <div style={tableValStyle}>{secondName ?? "—"}</div>
          </div>

          <div style={dividerStyle} />

          <div style={tableRowStyle}>
            <div style={tableKeyStyle}>3위</div>
            <div style={tableValStyle}>{semiNames.length > 0 ? semiNames.join(" / ") : "—"}</div>
          </div>
        </div>
      </div>

      {/* ✅ RESTART 버튼 이미지 */}
      <button
        onClick={() => router.push("/")}
        aria-label="restart"
        style={{
          marginTop: 14,
          width: "100%",
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="/main/btn_restart.png"
          alt="RESTART"
          style={{
            width: "min(200px, 78%)",
            height: "auto",
            display: "block",
          }}
        />
      </button>
    </main>
  );
}

/* ---------- styles ---------- */
const pageStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: 16,
  paddingTop: "8svh",
  fontFamily: "Rimgul",
};

const winnerCardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  margin: "12px auto 0",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 12,
  background: "#fff",
};

const tableWrapStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  margin: "0 auto",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: "10px 12px",
  background: "#fff",
};

const tableRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const tableKeyStyle: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.75,
  whiteSpace: "nowrap",
};

const tableValStyle: React.CSSProperties = {
  fontSize: 16,
  textAlign: "right",
  flex: 1,
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  background: "#e5e7eb",
  margin: "10px 0",
};

