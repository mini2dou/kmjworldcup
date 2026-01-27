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
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div style={{ width: "100%", maxWidth: 720, textAlign: "center" }}>
          <p>ERROR!</p>
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
            HOME
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 960, textAlign: "center" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          🏆 {winner.name} 🏆
        </h2>

        <div style={{ marginTop: 14 }}>
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
            fontWeight: 900,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          RESTART
        </button>
      </div>
    </main>
  );
}