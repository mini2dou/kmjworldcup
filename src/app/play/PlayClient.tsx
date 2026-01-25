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

export default function PlayClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const category = (sp.get("category") as Category) ?? "무대";

  const initialPool = useMemo(() => {
    const filtered = candidates.filter((c) => c.categories.includes(category));
    return shuffle(filtered);
  }, [category]);

  const [queue, setQueue] = useState<Candidate[]>([]);
  const [winners, setWinners] = useState<Candidate[]>([]);
  const [pair, setPair] = useState<{ left: Candidate; right: Candidate } | null>(null);

  useEffect(() => {
    setQueue(initialPool);
    setWinners([]);
    setPair(null);
  }, [initialPool]);

  useEffect(() => {
    // 후보가 0명이면 홈으로 (데이터/쿼리 문제)
    if (initialPool.length === 0) {
      router.push("/");
      return;
    }

    // 우승: queue에 1명만 남고 winners 비었으면 끝
    if (queue.length === 1 && winners.length === 0) {
      router.push(`/result?winnerId=${queue[0].id}`);
      return;
    }

    // 라운드 끝: queue 비면 winners로 다음 라운드
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

    // 홀수 자동통과: queue 1명 남고 winners도 있으면 자동 승자 처리
    if (queue.length === 1 && winners.length > 0) {
      setWinners((prev) => [...prev, queue[0]]);
      setQueue([]);
      setPair(null);
      return;
    }

    // pair 없으면 새로 세팅
    if (!pair && queue.length >= 2) {
      setPair({ left: queue[0], right: queue[1] });
    }
  }, [queue, winners, pair, router, initialPool.length]);

  const pick = (picked: Candidate) => {
    setWinners((prev) => [...prev, picked]);
    setQueue((prev) => prev.slice(2));
    setPair(null);
  };

  if (!pair) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{category} 월드컵</h2>
        <p style={{ marginTop: 10, opacity: 0.8 }}>준비 중...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800 }}>{category} 월드컵</h2>

      <div className="match">
        <CandidateCard candidate={pair.left} onSelect={() => pick(pair.left)} />
        <CandidateCard candidate={pair.right} onSelect={() => pick(pair.right)} />
      </div>
    </main>
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
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800 }}>{candidate.name}</div>

      <div style={{ marginTop: 10 }}>
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
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

      <button
        onClick={onSelect}
        style={{
          marginTop: 12,
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        이거 선택
      </button>
    </section>
  );
}
