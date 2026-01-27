"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const go = (category: string) => {
    router.push(`/play?category=${encodeURIComponent(category)}`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff", // ✅ 완전 흰 배경
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* 전체 컨텐츠 래퍼 */}
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 로고 */}
        <img
          src="/main/logo.png"
          alt="Choose Your MHAE"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            marginBottom: 48, // ✅ 로고 ↔ 버튼 간격 크게
          }}
        />

        {/* 버튼 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14, // 버튼 사이 간격
          }}
        >
          <button
            onClick={() => go("무대")}
            aria-label="무대 월드컵 시작"
            style={{
              background: "transparent",
              border: 0,
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <img
              src="/main/btn_stage.png"
              alt="STAGE"
              style={{
                width: 200,
                height: "auto",
                display: "block",
              }}
            />
          </button>

          <button
            onClick={() => go("보컬")}
            aria-label="보컬 월드컵 시작"
            style={{
              background: "transparent",
              border: 0,
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <img
              src="/main/btn_vocal.png"
              alt="VOCAL"
              style={{
                width: 200,
                height: "auto",
                display: "block",
              }}
            />
          </button>

          <button
            onClick={() => go("댄스")}
            aria-label="댄스 월드컵 시작"
            style={{
              background: "transparent",
              border: 0,
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <img
              src="/main/btn_dance.png"
              alt="DANCE"
              style={{
                width: 200,
                height: "auto",
                display: "block",
              }}
            />
          </button>
        </div>
      </div>
    </main>
  );
}


