import { Suspense } from "react";
import PlayClient from "./PlayClient";

export default function PlayPage() {
  return (
    <Suspense fallback={<main style={{fontFamily: "Rimgul", textAlign: "center"}}> LOADING... </main>}>
      <PlayClient />
    </Suspense>
  );
}
