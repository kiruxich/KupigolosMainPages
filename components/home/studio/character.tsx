import { Cloth, CharacterInk } from "./character-ink";
import { Pen, INK, PAPER } from "./pen";
import { SEATED, transforms } from "./studio-rig";

const initial = transforms(SEATED);

function Sleeve({ lower, id }: { lower?: boolean; id: string }) {
  const d = lower
    ? "M-27-8Q-33 8-28 30Q-29 43-21 56L-22 78Q-26 92-17 102L-14 114Q-1 120 17 112L19 98Q28 91 24 77L25 54Q33 30 27 8L21-9Z"
    : "M-22-9Q-43-6-43 19Q-44 35-38 51L-36 73Q-43 89-34 104Q-38 118-23 129Q-4 139 20 128Q34 117 30 100L32 73Q40 42 31 16Q28-6 12-12Z";
  return (
    <>
      <Cloth id={id} d={d} seed={lower ? 211 : 210} box={[-45, -15, 88, 160]}>
        <g fill="#536577" opacity=".2">
          <path d={lower ? "M-27 30Q-13 51 14 48L-12 53-22 60ZM-23 79Q-4 98 22 78L10 93-18 98Z" : "M-40 43Q-25 67-3 70L-34 58ZM-38 81Q-12 98 27 91L3 104-34 94ZM-29 112Q-8 123 26 105L14 122-19 129Z"} />
        </g>
        <g fill="none" stroke={INK} strokeWidth=".65" opacity=".75">
          <path d={lower ? "M-23 13Q-20 36-7 41M-24 47q19 12 40 2M-19 55q14 4 23 1M-21 78q14 17 33 9M-18 96q15 8 35-1M18 13Q13 30 17 43" : "M-29 4Q-35 25-28 50M-37 58q17 15 31 12M-31 66l16 9M-35 90q22 13 47 6M-28 99l23 5M-27 112q19 7 40-3M18 17Q25 37 17 55"} />
          <path d={lower ? "M-14 15Q-9 30-9 35M-10 68l4 12M10 69l-5 8" : "M-20 13Q-24 32-16 48M11 30l-3 21M-16 77l6 6M16 104l-8 5"} stroke="#f8f7f3" strokeWidth="1.8" />
        </g>
      </Cloth>
      {lower && <g>
        <Pen d="M-16 102Q0 110 20 102L18 123Q0 129-15 123Z" seed={213} fill="#c6ccce" weight={.8} />
        <path d="M-16 102Q0 110 20 102L18 123Q0 129-15 123Z" fill={`url(#${id.split("--")[0]}-knit)`} />
        <path d="M-14 106q16 6 32-1M-14 121q15 5 30 0" stroke={INK} strokeWidth=".6" fill="none" />
      </g>}
    </>
  );
}

function Trouser({ lower, id }: { lower?: boolean; id: string }) {
  const d = lower
    ? "M-26-12Q-31 4-28 27L-25 67Q-28 82-25 98L-25 129Q-7 137 24 128L25 109Q21 95 24 77L27 40Q32 14 24-11Z"
    : "M-31-14Q-39 4-35 31L-29 72Q-30 93-26 107L-30 127Q-13 143 21 133Q33 124 28 109L32 74 33 23Q34 0 22-13Z";
  return (
    <>
      <Cloth id={id} d={d} seed={lower ? 216 : 215} box={[-40, -20, 80, 165]} denim>
        <path d={lower ? "M-26 20Q-12 50-25 99L-20 125-28 128ZM24 27Q7 72 17 110L9 126 24 128ZM-26 82l32-14-19 19ZM-20 112l35-11-21 15Z" : "M-32 13Q-18 65-29 91L-18 104-30 116ZM29 4Q17 62 29 93L13 114 23 128 34 111ZM-24 102l35-12-23 16ZM-29 120l40-10-23 17Z"} fill="#243b51" opacity=".48" />
        <g stroke="#d9ddda" strokeWidth=".65" opacity=".8" fill="none">
          <path d={lower ? "M-18 12Q-18 61-19 102L-19 119M-15 12Q-14 51-16 75M17 5Q13 34 14 55M-20 95l24-9m-18 17 13-4m-17 23 29-6" : "M-23 8Q-24 47-19 76M-20 9Q-19 48-16 70M20 12Q16 60 19 82M-21 95l24-7m-21 11 14-4m-15 22 25-9"} />
        </g>
        <path d="M-25 5Q-27 46-23 74L-23 99M24 6Q20 51 22 75" fill="none" stroke={INK} strokeWidth="1" opacity=".75" />
      </Cloth>
      {lower && <g>
        <Pen d="M-26 126Q-4 133 25 125L24 141Q-3 148-26 140Z" seed={218} fill="#87949f" weight={.9} />
        <path d="M-24 129q25 7 47-1M-23 137q23 6 45-1M-22 132l1 6m4-5v6m5-5v6m5-5v5m5-5v5m5-6v6m5-6v5m5-7v6" fill="none" stroke={INK} strokeWidth=".65" />
      </g>}
    </>
  );
}

function Shoe({ id }: { id: string }) {
  return (
    <g>
      <Pen d="M-18-11Q-10-5 8-10L12 1 22 6 23 14-20 15Z" seed={221} fill={`url(#${id}-skin)`} weight={.75} />
      <Pen d="M-23 3Q-18 13-6 12L9 3Q18 4 24 12L39 19Q53 19 63 24Q72 28 69 36Q20 46-25 35L-27 22Z" seed={222} fill="#e9e9e2" weight={1} />
      <path d="M-24 20Q-11 31 15 22L22 12M-20 24Q-1 33 20 25L30 18M13 8 7 22M26 16l12 12M38 25Q57 24 65 29M-25 29Q14 39 69 30L70 37Q20 48-25 38Z" fill={PAPER} stroke={INK} strokeWidth=".8" />
      <path d="M-25 35Q17 44 69 35M-18 22l.5 6m4-4 .5 6m4-4v5M15 10l10 1m-12 4 15 1m-14 4 20 1m-17 3 20 1" fill="none" stroke={INK} strokeWidth=".8" />
      <g fill={INK}>
        <circle cx="13" cy="11" r="1.25" /><circle cx="13" cy="16" r="1.25" /><circle cx="15" cy="21" r="1.25" /><circle cx="20" cy="25" r="1.25" />
      </g>
      <path d="M15 9Q1-1 1 5T15 9Q22-4 28 2T15 9m0 0-5 9m6-9 12 10" fill="none" stroke={INK} strokeWidth=".9" />
      <path d="M-13 20q4-5 10-1l-1 4h-8Z" fill="#b3bdc2" stroke={INK} strokeWidth=".65" />
    </g>
  );
}

function Fingers({ id, pointer = false }: { id: string; pointer?: boolean }) {
  const d = pointer
    ? "M-11-3 10-3 11 10Q13 17 8 23L7 58Q7 64 3 64Q0 64 0 59L-2 29-6 31Q-12 36-15 30L-20 17Q-23 12-19 10Q-16 9-12 16L-8 21-12 8Z"
    : "M-12-4 10-4 12 8Q15 15 18 23Q19 29 15 30L9 18 11 35Q11 41 7 40L3 24 5 42Q5 47 1 45L-3 27-2 43Q-3 48-7 44L-9 28-10 39Q-12 43-15 39L-17 17Q-18 9-12-4Z";
  return (
    <g>
      <Pen d={d} seed={pointer ? 227 : 226} fill={`url(#${id}-skin)`} weight={.85} />
      <path d={pointer ? "M-10 11-3 17 5 17M-7 24l8 2M1 37l5 1M2 53h4M-14 19l3 8" : "M-11 9q8 2 18 7M-10 16l7 4M-11 25l3 2M-5 29l3 1M1 29l3 1M7 29h3M-8 4l3 8"} fill="none" stroke={INK} strokeWidth=".55" opacity=".8" />
      <path d={pointer ? "M2 58q1-4 4-2v5H2Z" : "M-14 36l2 3m6 3h3m4 0h3m5-5h3"} fill="none" stroke="#657582" strokeWidth=".55" />
    </g>
  );
}

const hair = "M-32 31Q-46 31-47 19Q-58 16-51 4Q-62-5-52-14Q-60-24-47-29Q-53-41-38-44Q-38-56-25-51Q-18-65-7-54Q5-65 14-55Q25-61 31-50Q43-53 45-43Q49-36 38-30L29-24Q21-27 18-34Q14-22 3-19L-7-12-9 10-20 8-21 29Z";

function Head({ id }: { id: string }) {
  return (
    <g>
      <Pen d="M-18 26-21 47Q-3 60 21 50L18 35Z" seed={231} fill={`url(#${id}-skin)`} weight={.8} />
      <path d="M-15 34Q-4 47 16 39L16 48-5 53-15 47Z" fill="#6c7b87" opacity=".35" />
      <Pen d="M-28-22Q-13-45 11-38Q32-34 31-14L32-6Q32-2 37 3L43 9Q45 13 38 14L34 14 35 20Q40 22 36 25L35 27Q39 30 34 32L33 39Q32 45 23 46L9 45Q-4 43-11 35L-22 24Q-34 19-32 7Z" seed={232} fill={`url(#${id}-skin)`} weight={.95} />
      <path d="M-13 15Q-7 32 11 38L26 39M4 26q8 3 14-1M25 15l5-2M29-11l-3 11" stroke="#6b7b87" strokeWidth=".6" fill="none" />
      <path d="M19-5Q26-10 33-5L31-3Q24-5 19-3Z" fill={INK} />
      <path d="M22 1q5-3 10 1M23 3q5 1 8 0M33 12l5-1M32 22l5 1M29 30q4 2 7 0" stroke={INK} strokeWidth=".85" fill="none" />
      <ellipse cx="28" cy="2" rx="1.4" ry="1.7" fill={INK} />
      <g data-part="mouth" transform={initial.mouth}><path d="M-2-1Q3-3 5 0Q5 4 1 5L-2 3Z" fill={INK} /></g>
      <path d="M-24 0Q-35-7-34 7Q-35 21-23 24L-17 16-17 7Z" fill={`url(#${id}-skin)`} stroke={INK} strokeWidth=".85" />
      <path d="M-25 5q-9-5-6 8l5 3m-3-7 5 1-2 7" fill="none" stroke={INK} strokeWidth=".6" />
      <Pen d={hair} seed={235} fill="#293c50" weight={.95} />
      <defs><clipPath id={`${id}-hair-cut`}><path d={hair} /></clipPath></defs>
      <g clipPath={`url(#${id}-hair-cut)`} fill="none">
        {Array.from({ length: 54 }, (_, i) => {
          const x = -48 + (i % 9) * 10 + (Math.floor(i / 9) % 2) * 4;
          const y = -48 + Math.floor(i / 9) * 14;
          return <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 37) % 100 - 50})`}>
            <path d="M-7 8C-14-3-5-12 3-6S8 8 2 11Q-4 13-6 5" stroke="#121f31" strokeWidth="2.4" />
            <path d="M-8 4C-13-5-3-12 3-5S6 5 1 9" stroke="#aeb8be" strokeWidth=".8" />
            <path d="M-5 6C-11-2-2-8 1-3S3 3 0 5M-4-7q6-3 10 5" stroke="#e2e5dd" strokeWidth=".5" opacity=".8" />
          </g>;
        })}
      </g>
      <path d="M-44-29q-11-6-5-13M-23-49q-9-11-15-2M-9-53q7-13 15-3M19-49q17-7 21 5M-48 7q-12 6-4 15M-35 29q-4 8 5 9" stroke={INK} strokeWidth=".7" fill="none" />
      <g data-rear-hair opacity="1">
        <path d="M-16-17Q5-27 18-33Q26-21 15-8L5 6 0 26-13 39-25 30-19 9Z" fill="#293c50" />
        <path d="M-13-11Q4-20 12-28M-12-6Q6-15 11-23M-12 0q12-6 19-18M-15 8Q-1 6 5-10M-18 17q13 3 19-11M-18 24q10 7 15-7M-14 32q8-1 11-9" fill="none" stroke="#b5bec0" strokeWidth=".65" />
      </g>
    </g>
  );
}

export function Headphones({ worn = false, id }: { worn?: boolean; id: string }) {
  if (worn) return (
    <g>
      <Pen d="M-39 1Q-50-29-29-52Q-23-58-16-52L-12-43Q-31-24-29-1Z" seed={241} fill={`url(#${id}-phones)`} weight={1} />
      <path d="M-36-4Q-43-29-23-50M-33-5Q-38-27-19-48" fill="none" stroke="#d3d8d8" strokeWidth="1.1" />
      <path d="M-39-1-34 15-19 10-24-5Z" fill="#4c6172" stroke={INK} strokeWidth="1" />
      <ellipse cx="-25" cy="14" rx="20" ry="23" transform="rotate(-18 -25 14)" fill="#293b4f" stroke={INK} />
      <ellipse cx="-22" cy="13" rx="16" ry="20" transform="rotate(-18 -22 13)" fill={`url(#${id}-phones)`} stroke="#adb9c0" strokeWidth=".85" />
      <ellipse cx="-21" cy="13" rx="11" ry="15" transform="rotate(-18 -21 13)" fill="none" stroke="#d2d7d7" strokeWidth=".65" />
      <path d="M-25 4q9 2 11 10m-13-6 10 12m-13-7 8 12M-40 8q-4 17 10 25" fill="none" stroke="#263b50" strokeWidth=".75" />
    </g>
  );
  return (
    <g>
      <Pen d="M-36 14Q-41-58 1-61Q46-64 43 14L34 14Q34-47 2-48Q-29-47-27 15Z" seed={244} fill={`url(#${id}-phones)`} />
      <Pen d="M-38 4Q-49 9-47 36Q-45 61-29 58L-18 51-17 15-25 4Z" seed={245} fill="#344a5e" />
      <Pen d="M32 3Q48 1 51 19L51 43Q47 60 33 58L24 47 24 17Z" seed={246} fill="#344a5e" />
      <ellipse cx="-32" cy="30" rx="11" ry="22" fill={`url(#${id}-phones)`} stroke="#9dabb4" />
      <ellipse cx="39" cy="30" rx="9" ry="20" fill={`url(#${id}-phones)`} stroke="#9dabb4" />
      <path d="M-33-35q25-26 56-2M-39 9v39M45 9v38M-31 11q-11 20 0 39M39 11q12 18 0 37" fill="none" stroke="#bfc8cb" strokeWidth=".8" />
    </g>
  );
}

function Torso({ id }: { id: string }) {
  const d = "M-19-199Q-37-196-56-176Q-71-151-64-121L-58-86Q-64-61-56-39L-54-18Q-52-8-37-6Q1 4 45-8Q60-10 58-27L52-66Q52-103 48-140Q47-168 26-191L17-197Q0-190-19-199Z";
  return (
    <g>
      <Cloth id={`${id}--body`} d={d} seed={251} box={[-74, -210, 143, 220]}>
        <path d="M-51-169Q-34-152-38-113L-32-76Q-32-53-51-25L-56-39-55-83ZM43-158Q25-132 37-95L35-57 21-25 48-13 57-28 49-86ZM-51-29Q-7-1 47-29L44-14Q-9 3-51-17Z" fill="#687987" opacity=".25" />
        <path d="M-25-169Q-12-125-23-88L-29-63Q-17-74-10-96L-8-139ZM13-171Q24-143 18-113L8-80Q22-90 27-120L25-158Z" fill="#fbf9ee" opacity=".46" />
        <g stroke={INK} strokeWidth=".7" fill="none" opacity=".8">
          <path d="M-52-172q22 9 25 33M-59-143q16 24 15 57M-49-79q5 28-4 42M-47-36q30 14 49 8M-38-26q35 13 71-2M41-153q-8 23-4 42M37-77q-1 30-15 45M-28-147l7 17M-22-80l-8 15M10-54l14-23M-40-17q28 6 48 2" />
        </g>
        <path data-back-seam d="M-47-176Q-7-154 36-176M-47-172Q-5-149 38-172M-16-154Q-10-117-15-94" fill="none" stroke={INK} strokeWidth=".75" opacity="1" />
      </Cloth>
      <Pen d="M-22-200Q-3-186 19-199L25-191Q3-176-27-191Z" seed={253} fill="#b4bec2" weight={.75} />
      <path d="M-22-200Q-3-186 19-199L25-191Q3-176-27-191Z" fill={`url(#${id}-knit)`} />
      <Pen d="M-52-20Q-4-9 54-23L54-7Q2 9-49-4Z" seed={254} fill="#b6c0c5" weight={.85} />
      <path d="M-52-20Q-4-9 54-23L54-7Q2 9-49-4Z" fill={`url(#${id}-knit)`} />
      <path d="M-48-16Q0-4 49-18M-47-7Q-3 6 50-9" stroke={INK} strokeWidth=".7" fill="none" />
    </g>
  );
}

export function Character({ id }: { id: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <CharacterInk id={id} />
      <g data-part="backThigh" transform={initial.backThigh}><Trouser id={`${id}--back-thigh`} /></g>
      <g data-part="backShin" transform={initial.backShin}><Trouser lower id={`${id}--back-shin`} /></g>
      <g data-part="backShoe" transform={initial.backShoe}><Shoe id={id} /></g>
      <g data-part="frontUpperArm" transform={initial.frontUpperArm}><Sleeve id={`${id}--front-arm`} /></g>
      <g data-part="frontForearm" transform={initial.frontForearm}><Sleeve lower id={`${id}--front-forearm`} /></g>
      <g data-part="frontHand" transform={initial.frontHand}>
        <g data-fingers><Fingers id={id} /></g>
        <g data-pointer opacity="0"><Fingers id={id} pointer /></g>
      </g>
      <g data-part="frontThigh" transform={initial.frontThigh}><Trouser id={`${id}--front-thigh`} /></g>
      <g data-part="frontShin" transform={initial.frontShin}><Trouser lower id={`${id}--front-shin`} /></g>
      <g data-part="frontShoe" transform={initial.frontShoe}><Shoe id={id} /></g>
      <g data-part="pelvis" transform={initial.pelvis}>
        <Cloth id={`${id}--hips`} d="M-47-20Q-4-28 44-22L44 28Q35 45 14 47L-2 33-17 47-45 32Z" seed={256} box={[-50, -25, 100, 80]} denim>
          <path d="M-36-9Q-37 13-13 18L-12-6M-33-6Q-33 11-16 13M8-9l2 37M13-9l2 32M-44-16Q1-10 41-17M-36-16v10m30-9v10m32-11v9" fill="none" stroke="#d7dcda" strokeWidth=".7" />
          <path d="M-2 15 3 32 17 39M-39 22l19-4m-16 11 20-7M20 14l14 8" fill="none" stroke={INK} strokeWidth=".85" />
        </Cloth>
      </g>
      <g data-part="torso" transform={initial.torso}><Torso id={id} /></g>
      <g data-part="head" transform={initial.head}><Head id={id} /></g>
      <g data-part="wornPhones" transform={initial.wornPhones} opacity="0"><Headphones worn id={id} /></g>
      <g data-part="backUpperArm" transform={initial.backUpperArm}><Sleeve id={`${id}--back-arm`} /></g>
      <g data-part="backForearm" transform={initial.backForearm}><Sleeve lower id={`${id}--back-forearm`} /></g>
      <g data-part="backHand" transform={initial.backHand}><Fingers id={id} /></g>
    </g>
  );
}
