"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "./data/candidates";

const categories: Category[] = ["무대", "보컬", "댄스"];

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Category>("무대");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>김민재 이상형 월드컵</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: selected === c ? "#111" : "#fff",
              color: selected === c ? "#fff" : "#111",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push(`/play?category=${encodeURIComponent(selected)}`)}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "none",
          background: "#2563eb",
          color: "white",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        시작하기
      </button>
    </main>
  );
}