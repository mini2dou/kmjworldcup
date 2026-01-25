"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { candidates } from "../data/candidates";

export default function ResultClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const winnerId = Number(sp.get("winnerId"));

  const winner = useMemo(() => {
    return candidates.find((c) => c.id === winnerId) ?? null;
  }, [winnerId]);

  if (!winner) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <p>결과를 불러올 수 없어. 다시 시작해줘.</p>
        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          홈으로
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 900 }}>최종 1위</h2>
      <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>
        {winner.name}
      </div>

      <div style={{ marginTop: 12 }}>
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

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "none",
          background: "#2563eb",
          color: "white",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        다시 하기
      </button>
    </main>
  );
}