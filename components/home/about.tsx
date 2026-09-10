"use client";

import { useEffect, useId, useRef } from "react";
import { Character, Headphones } from "./studio/character";
import { Chair, Desk, Ground, Microphone } from "./studio/equipment";
import { INK, PenDefs } from "./studio/pen";
import { SEATED, transforms } from "./studio/studio-rig";
import styles from "./about.module.css";

const initial = transforms(SEATED);

export function About() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const id = `studio-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const scene = sceneRef.current;
    const svg = svgRef.current;
    const cta = ctaRef.current;
    if (!scene || !svg || !cta) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let requested = false;
    // Bring in the animation engine only as this section approaches the viewport.
    const observer = new IntersectionObserver((entries) => {
      if (requested || !entries.some(entry => entry.isIntersecting)) return;
      requested = true;
      observer.disconnect();
      void import("./studio/animate-studio").then(({ animateStudio }) => {
        if (!disposed) cleanup = animateStudio(svg, scene, cta);
      }).catch(() => {
        // The server-rendered SVG and native link remain usable if loading fails.
        if (!disposed) scene.dataset.state = "still";
      });
    }, { rootMargin: "500px 0px" });
    observer.observe(scene);
    return () => {
      disposed = true;
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
            <a className={styles.cta} href="#contacts" ref={ctaRef}>
              Обсудить проект
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>
            </a>
          </div>
          <svg
            ref={svgRef}
            className={styles.artwork}
            viewBox="0 260 1536 635"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <PenDefs id={id} />
            <Ground />
            <Desk id={id} />
            <Character id={id} />
            <Chair id={id} />
            <Microphone id={id} />
            <path data-headphone-cable d="M1287 564C1310 684 1260 817 1190 849Q1240 863 1290 848" stroke={INK} strokeWidth="1.2" />
            <g data-part="loosePhones" transform={initial.loosePhones}><Headphones id={id} /></g>
          </svg>
          <p className="sr-only">
            Нарисованный штрихами музыкант работает за компьютером, встаёт,
            подходит к микрофону, надевает наушники и записывает трек.
            Закончив запись, он опускает руки, затем указывает на кнопку
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
