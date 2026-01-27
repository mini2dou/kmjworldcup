import styles from "./test.module.css"; 

export default function TestPage() {
  return (
    <main className={styles.y2k}>
      <header className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.spark}>*</span>
          <span className={styles.title}>Air</span>
          <span className={styles.smile}>˘</span>
        </div>
        <div className={styles.brand2}>Train</div>

        <div className={styles.chips}>
          <span className={styles.chip}>SHARE</span>
          <span className={`${styles.chip} ${styles.dark}`}>PPT</span>
        </div>
      </header>

      <section className={styles.stage}>
        <div className={styles.panel}>
          <button className={styles.startBtn} type="button">
            <span className={styles.frame}>
              <span className={styles.inner}>Press Start!</span>
            </span>
            <span className={styles.cursor} aria-hidden />
          </button>
        </div>
      </section>
    </main>
  );
}