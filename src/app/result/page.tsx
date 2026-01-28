import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<main style={{fontFamily: "Rimgul", textAlign: "center"}}> LOADING... </main>}>
      <ResultClient />
    </Suspense>
  );
}

