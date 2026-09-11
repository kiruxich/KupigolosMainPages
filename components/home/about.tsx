"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./about.module.css";

export function About() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const cta = ctaRef.current;
    if (!scene || !canvas || !cta) return;
    const controller = new AbortController();
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let requested = false;
    // Bring in the animation engine only as this section approaches the viewport.
    const observer = new IntersectionObserver((entries) => {
      if (requested || !entries.some(entry => entry.isIntersecting)) return;
      requested = true;
      observer.disconnect();
      void import("./studio/pixi-studio").then(async ({ mountStudio }) => {
        if (disposed) return;
        const dispose = await mountStudio(canvas, scene, cta, controller.signal);
        if (disposed) dispose(); else cleanup = dispose;
      }).catch((error: unknown) => {
        // Keep the illustrated still and native link available without WebGL.
        if (!disposed) scene.dataset.state = "still";
        if (!disposed && process.env.NODE_ENV === "development") console.warn("Studio animation unavailable", error);
      });
    }, { rootMargin: "500px 0px" });
    observer.observe(scene);
    return () => {
      disposed = true;
      controller.abort();
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <section className={styles.root} id="about" aria-labelledby="about-title">
      <div className={`shell ${styles.shell}`}>
        <div className={styles.scene} ref={sceneRef} data-state="waiting">
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Студия КупиГолос</p>
            <h2 id="about-title">От первой идеи <span>до готового трека.</span></h2>
          </header>
          <div className={styles.aside}>
            <p>Придумываем. Записываем. Сводим.</p>
            <a className={`studio-cta ${styles.cta}`} href="#contacts" ref={ctaRef}>
              <span>Обсудить проект</span>
            </a>
          </div>
          <div className={styles.artwork} ref={canvasRef} aria-hidden="true">
            <Image className={`${styles.poster} ${styles.initialPoster}`} src="/assets/studio/textures/initial-poster.webp"
              width={1536} height={680} alt="" unoptimized />
            <Image className={`${styles.poster} ${styles.finalPoster}`} src="/assets/studio/textures/poster.webp"
              width={1536} height={680} alt="" unoptimized />
            <span className={styles.recordingStatus} style={{ opacity: "var(--studio-recording-status, 0)" }}><i />Запись</span>
            <span className={styles.recordingStatus} style={{ opacity: "var(--studio-listening-status, 0)", color: "var(--studio-ink)" }}>Прослушивание</span>
          </div>
          <p className="sr-only">
            Нарисованный штрихами музыкант работает за компьютером,
            рассыпается песком и собирается у микрофона в наушниках.
            Он держит наушник и озвучивает текст с открытой ладонью.
            Закончив запись, он слушает результат в наушниках и кивает в такт,
            затем указывает на кнопку
            «Обсудить проект» и остаётся в этой позе.
          </p>
          <ol className={styles.steps} aria-label="От идеи до готового трека">
            <li><span>01 / Идея</span></li>
            <li><span>02 / Запись</span></li>
            <li><span>03 / Готовый трек</span></li>
          </ol>
        </div>
      </div>
    </section>
  );
}
