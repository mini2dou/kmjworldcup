"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState("");

  return (
    <main
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>김민재 이상형 월드컵</h1>
      <p style={{ marginBottom: "20px" }}>
        무대 / 보컬 / 댄스 중 하나를 선택하세요
      </p>

      {/* 카테고리 버튼 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <button
          style={{ padding: "14px", fontSize: "16px" }}
          onClick={() => setCategory("무대")}
        >
          무대
        </button>
        <button
          style={{ padding: "14px", fontSize: "16px" }}
          onClick={() => setCategory("보컬")}
        >
          보컬
        </button>
        <button
          style={{ padding: "14px", fontSize: "16px" }}
          onClick={() => setCategory("댄스")}
        >
          댄스
        </button>
      </div>

      <p style={{ marginBottom: "20px" }}>
        선택된 카테고리: <strong>{category || "없음"}</strong>
      </p>

      {/* 시작 버튼 */}
      <button
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
        onClick={() => {
          if (!category) return;
          router.push(`/worldcup?category=${category}`);
        }}
      >
        시작하기
      </button>
    </main>
  );
}
