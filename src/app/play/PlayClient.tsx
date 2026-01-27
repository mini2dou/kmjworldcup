"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { candidates, type Candidate, type Category } from "../data/candidates";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function titleImageForCategory(category: Category) {
  if (category === "무대") return "/main/title_stage1.png";
  if (category === "보컬") return "/main/title_vocal1.png";
  return "/main/title_dance1.png";
}

export default function PlayClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const category = (sp.get("category") as Category) ?? "무대";

  const titleImgSrc = titleImageForCategory(category);

  const initialPool = useMemo(() => {
    const filtered = candidates.filter((c) => c.categories.includes(category));
    return shuffle(filtered);
  }, [category]);

  const totalCount = initialPool.length;

  const [queue, setQueue] = useState<Candidate[]>([]);
  const [winners, setWinners] = useState<Candidate[]>([]);
  const [pair, setPair] = useState<{ left: Candidate; right: Candidate } | null>(null);

  useEffect(() => {
    setQueue(initialPool);
    setWinners([]);
    setPair(null);
  }, [initialPool]);

  useEffect(() => {
    if (initialPool.length === 0) {
      router.push("/");
      return;
    }

    if (queue.length === 1 && winners.length === 0) {
      router.push(`/result?winnerId=${queue[0].id}`);
      return;
    }

    if (queue.length === 0 && winners.length > 0) {
      if (winners.length === 1) {
        router.push(`/result?winnerId=${winners[0].id}`);
        return;
      }
      setQueue(shuffle(winners));
      setWinners([]);
      setPair(null);
      return;
    }

    if (queue.length === 1 && winners.length > 0) {
      setWinners((prev) => [...prev, queue[0]]);
      setQueue([]);
      setPair(null);
      return;
    }

    if (!pair && queue.length >= 2) {
      setPair({ left: queue[0], right: queue[1] });
    }
  }, [queue, winners, pair, router, initialPool.length]);

  const pick = (picked: Candidate) => {
    setWinners((prev) => [...prev, picked]);
    setQueue((prev) => prev.slice(2));
    setPair(null);
  };

  // 진행률(0~100)
  const remaining = queue.length + winners.length;
  const progressRaw = totalCount > 0 ? (totalCount - remaining) / totalCount : 0;
  const progress = Math.max(0, Math.min(1, progressRaw));
  const progressPercent = Math.round(progress * 100);

  if (!pair) {
    return (
      <main style={pageStyle}>
        <Header titleImgSrc={titleImgSrc} progress={progress} progressPercent={progressPercent} />
        <p style={{ marginTop: 10, opacity: 0.75, textAlign: "center" }}>준비 중...</p>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <Header titleImgSrc={titleImgSrc} progress={progress} progressPercent={progressPercent} />

      {/* ✅ 모바일 1열 / PC 2열 */}
      <div className="match-grid" style={matchGridStyle}>
        <CandidateCard candidate={pair.left} onSelect={() => pick(pair.left)} />
        <CandidateCard candidate={pair.right} onSelect={() => pick(pair.right)} />
      </div>
    </main>
  );
}

/* ---------- styles ---------- */
const pageStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  padding: 16,
};

const matchGridStyle: React.CSSProperties = {
  marginTop: 12,
  display: "grid",
  gap: 14,
  alignItems: "start",
  justifyItems: "center"
};

function Header({
  titleImgSrc,
  progress,
  progressPercent,
}: {
  titleImgSrc: string;
  progress: number; // 0~1
  progressPercent: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* ✅ 타이틀 더 작게 */}
      <img
        src={titleImgSrc}
        alt="월드컵 타이틀"
        style={{
          width: "min(200px, 60vw)", // 👈 줄임
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />

      <div
        aria-label={`progress ${progressPercent}%`}
        style={{
          width: "100%",
          maxWidth: 420,
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
          marginTop: 10,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#4F63FF",
            borderRadius: 999,
            transition: "width 180ms ease",
          }}
        />
      </div>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>{progressPercent}%</div>

      {/* ✅ CSS 한 줄로 PC 2열 만들기 (인라인로는 media query가 어려워서) */}
      <style>{`
  /* 세로(폰) 기본: 1열은 matchGridStyle에서 이미 적용됨 */

  /* ✅ 가로가 더 긴 화면(PC/아이패드 가로 등)에서는 2열 */
        @media (orientation: landscape) {
          .match-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  );
}

function CandidateCard({
  candidate,
  onSelect,
}: {
  candidate: Candidate;
  onSelect: () => void;
}) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 12,
        background: "#fff",
        maxWidth: 420,
        margin:"0 auto"
      }}
    >
      {/* 후보 이름 */}
      <div style={{fontSize: 16, fontWeight: 400, fontFamily: "Rimgul", letterSpacing: "0.02em", textAlign: "center"}}>
        {candidate.name}
      </div>

      {/* 영상 */}
      <div style={{ marginTop: 8 }}>
        <div style={{ position: "relative", paddingTop: "56.25%"}}>
          <iframe
            src={candidate.video}
            title={candidate.name}
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

      {/* ✅ SELECT 버튼 더 작게 + 스크롤 줄이기 */}
      <button
        onClick={onSelect}
        aria-label={`${candidate.name} 선택`}
        style={{
          marginTop: 10,
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
          src="/main/btn_select.png"
          alt="SELECT"
          style={{
            width: "min(220px, 85%)", // 👈 줄임
            height: "auto",
            display: "block",
          }}
        />
      </button>
    </section>
  );
}

