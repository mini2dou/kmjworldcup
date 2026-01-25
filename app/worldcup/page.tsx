"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { candidates, type Category } from "../data/candidates";

export default function WorldcupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get("category");

  const isCategory = (v: string): v is Category =>
    v === "무대" || v === "보컬" || v === "댄스";

  const category: Category | null =
    selectedCategory && isCategory(selectedCategory) ? selectedCategory : null;

  const [round, setRound] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winners, setWinners] = useState<any[]>([]);
  const [champion, setChampion] = useState<any>(null);

  // 카테고리 바뀌면 후보 세팅
  useEffect(() => {
    if (!category) return;

    const filtered = candidates.filter((c) => c.categories.includes(category));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    setRound(shuffled);
    setCurrentIndex(0);
    setWinners([]);
    setChampion(null);
  }, [category]);

  // 우승자 나오면 결과 페이지로 이동
  useEffect(() => {
    if (!champion) return;

    router.push(
      `/result?name=${encodeURIComponent(champion.name)}&video=${encodeURIComponent(
        champion.video
      )}`
    );
  }, [champion, router]);

  // ✅ 홀수(마지막 1명 남음)일 때 자동 진출 처리 (렌더 중 setState 금지)
  useEffect(() => {
    if (round.length < 2) return;
    if (currentIndex !== round.length - 1) return; // 마지막 1명만 남은 상황
    if (champion) return;

    const byeWinner = round[currentIndex];
    const nextWinners = [...winners, byeWinner];

    // 이 라운드가 끝났으니 다음 라운드/우승 처리
    if (nextWinners.length === 1) {
      setChampion(nextWinners[0]);
    } else {
      setRound(nextWinners);
      setWinners([]);
      setCurrentIndex(0);
    }
  }, [round, currentIndex, winners, champion]);

  if (!category) {
    return (
      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        <p>카테고리가 없습니다.</p>
        <button style={{ padding: "12px 16px" }} onClick={() => router.push("/")}>
          홈으로
        </button>
      </main>
    );
  }

  if (round.length < 2) {
    return (
      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        <p>후보가 부족합니다.</p>
        <button style={{ padding: "12px 16px" }} onClick={() => router.push("/")}>
          홈으로
        </button>
      </main>
    );
  }

  const left = round[currentIndex];
  const right = round[currentIndex + 1];

  const chooseWinner = (winner: any) => {
    const nextWinners = [...winners, winner];
    setWinners(nextWinners);

    // 다음 매치로
    if (currentIndex + 2 < round.length) {
      setCurrentIndex(currentIndex + 2);
      return;
    }

    // 라운드 종료
    if (nextWinners.length === 1) {
      setChampion(nextWinners[0]);
    } else {
      setRound(nextWinners);
      setWinners([]);
      setCurrentIndex(0);
    }
  };

  // right가 없으면(홀수 마지막) 화면에는 left만 표시하고 자동 진출 effect가 처리함
  if (!right) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
        <p>마지막 후보 자동 진출 중…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "16px",
      }}
    >

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "8px" }}>{left.name}</h3>

          <iframe
            src={left.video}
            style={{ width: "100%", aspectRatio: "16 / 9" }}
            allowFullScreen
          />

          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "16px",
              marginTop: "10px",
            }}
            onClick={() => chooseWinner(left)}
          >
            선택
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: "8px" }}>{right.name}</h3>

          <iframe
            src={right.video}
            style={{ width: "100%", aspectRatio: "16 / 9" }}
            allowFullScreen
          />

          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "16px",
              marginTop: "10px",
            }}
            onClick={() => chooseWinner(right)}
          >
            선택
          </button>
        </div>
      </div>
    </main>
  );
}
