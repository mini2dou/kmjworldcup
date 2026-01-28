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

  const [roundSize, setRoundSize] = useState<number>(0); // 현재 라운드 시작 인원(2면 결승, 4면 4강)
  const [secondId, setSecondId] = useState<number | null>(null);
  const [semiLoserIds, setSemiLoserIds] = useState<number[]>([]);

  const [queue, setQueue] = useState<Candidate[]>([]);
  const [winners, setWinners] = useState<Candidate[]>([]);
  const [pair, setPair] = useState<{ left: Candidate; right: Candidate } | null>(null);

  useEffect(() => {
    setQueue(initialPool);
    setWinners([]);
    setPair(null);

    setRoundSize(initialPool.length);   // ✅ 첫 라운드 시작 인원
    setSecondId(null);                 // ✅ 결과 초기화
    setSemiLoserIds([]);
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
        const winner = winners[0];

        const params = new URLSearchParams();
        params.set("winnerId", String(winner.id));
        if (secondId != null) params.set("secondId", String(secondId));
        if (semiLoserIds.length > 0) params.set("semiIds", semiLoserIds.join(","));

        router.push(`/result?${params.toString()}`);
        return;
      }

      const nextQueue = shuffle(winners);
      setQueue(nextQueue);
      setWinners([]);
      setPair(null);
      setRoundSize(nextQueue.length); // ✅ 라운드 시작 인원 업데이트
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
  }, [queue, winners, pair, router, initialPool.length, secondId, semiLoserIds, roundSize]);

  const pick = (picked: Candidate) => {
    if (!pair) return;

    const loser = picked.id === pair.left.id ? pair.right : pair.left;

  // ✅ 결승(2강)에서 진 사람 = 2위
    if (roundSize === 2) {
      setSecondId(loser.id);
    }

  // ✅ 4강(준결승)에서 진 사람들 2명 = 공동 3위(4강 진출)
const nextRoundSize = Math.ceil(roundSize / 2);

if (nextRoundSize === 2) {
  setSemiLoserIds((prev) => {
    if (prev.includes(loser.id)) return prev;
    return [...prev, loser.id];
  });
}

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
        <p style={{ marginTop: 10, opacity: 0.75, textAlign: "center", fontFamily:"Rimgul" }}>LOADING...</p>
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
          width: "min(180px, 50vw)", // 👈 줄임
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

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.6, fontFamily: "Rimgul"}}>{progressPercent}%</div>

      {/* ✅ CSS 한 줄로 PC 2열 만들기 (인라인로는 media query가 어려워서) */}
      <style>{`
  /* 세로(폰) 기본: 1열은 matchGridStyle에서 이미 적용됨 */

  /* ✅ 가로가 더 긴 화면(PC/아이패드 가로 등)에서는 2열 */
@media (orientation: landscape) {
  .match-grid {
    grid-template-columns: repeat(2, minmax(0, 420px));
    justify-content: center;   /* 핵심 */
    column-gap: 10px;          /* 카드 사이 거리 직접 제어 */
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
        padding: 8,
        background: "#fff",
        maxWidth: 300,
        margin:"0 auto"
      }}
    >
      {/* 후보 이름 */}
      <div style={{fontSize: 16, fontWeight: 400, fontFamily: "Rimgul", letterSpacing: "0.02em", textAlign: "center"}}>
        {candidate.name}
      </div>

      {/* 영상 */}
      <div style={{ marginTop: 8 }}>
        <div className="videoWrap" style={{ position: "relative", paddingTop: "56.25%" }}>
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
            width: "min(150px, 65%)", // 👈 줄임
            height: "auto",
            display: "block",
          }}
        />
      </button>
    </section>
  );
}

