"use client";
export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const video = searchParams.get("video");

  return (
    <main
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>🏆 최종 1위</h1>
      <h2 style={{ marginBottom: "16px" }}>{name}</h2>

      {video && (
        <iframe
          src={video}
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            marginBottom: "20px",
          }}
          allowFullScreen
        />
      )}

      <button
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
        onClick={() => router.push("/")}
      >
        다시 하기
      </button>
    </main>
  );
}


