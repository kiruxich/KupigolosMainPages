import { Pen, INK, PAPER } from "./pen";
import { SEATED, transforms } from "./studio-rig";

const initial = transforms(SEATED);

function Sleeve({ lower, id }: { lower?: boolean; id: string }) {
  const length = lower ? 122 : 125;
  const d = lower
    ? "M-23-8 Q-27 23-20 52 L-16 108 Q-18 118-12 122 L15 122 Q20 116 17 105 L23 39 Q27 8 18-9Z"
    : "M-23-8 Q-40 8-34 37 L-25 101 Q-28 126-13 132 L14 130 Q28 121 26 107 L32 31 Q31 3 15-11Z";
  return (
    <>
      <Pen d={d} seed={lower ? 110 : 109} shade gap={7.5}>
        <path d={d} fill={`url(#${id}-cloth)`} stroke="none" />
      </Pen>
      <g fill="none" stroke={INK} strokeWidth=".8" opacity=".85">
        <path d={lower ? "M-17 12q12 9 23 7M-20 51q17-5 34 3M-14 95l22-11m-21 16 20-6" : "M-24 15q21 11 42 3M-29 43q8 23 13 44m-6 12 29-10m-24 17 27-7M20 29l-4 35"} />
        <path d={`M-15 ${length - 10}q14 5 30 0M-14 ${length - 5}q15 5 29 0`} />
      </g>
      {lower && <path d="M-15 106 17 106 16 122-13 122Z" fill={`url(#${id}-rib)`} stroke={INK} strokeWidth=".9" />}
    </>
  );
}

function Trouser({ lower, id }: { lower?: boolean; id: string }) {
  const d = lower
    ? "M-24-10Q-33 10-24 43L-19 128Q-21 140-11 144L21 142Q28 139 25 127L24 23Q26 4 20-10Z"
    : "M-31-8Q-42 12-32 44L-25 124Q-24 146-10 147L19 144Q29 141 28 126L33 27Q33 3 22-10Z";
  return (
    <>
      <Pen d={d} seed={lower ? 113 : 112} shade gap={2.8} fill="#e3e5e4">
        <path d={d} fill={`url(#${id}-cloth)`} stroke="none" />
      </Pen>
      <g fill="none" stroke={INK} strokeWidth=".8">
        <path d="M-21 6Q-17 51-15 92L-14 119M19 4Q16 58 17 105M-19 117l28-9m-23 17 31-8" />
        {!lower && <path d="M-24 13q17 7 25 0L6 51q-17 15-31 3M-22 15v34q13 8 24 0" />}
      </g>
      {lower && <Pen d="M-21 126 26 124 25 142-17 144Z" seed={115} shade gap={3} />}
    </>
  );
}

function Shoe() {
  return (
    <>
      <Pen d="M-20-9Q-8-2 12-11L24-6 33 9Q47 15 64 15Q74 18 72 29L-21 30Q-28 25-24 11Z" seed={117} shade gap={8}>
        <path d="M-24 23Q22 29 72 23L73 30Q31 38-23 32Z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      </Pen>
      <g stroke={INK} strokeWidth="1" fill="none">
        <path d="M-17-3-16 17q20 8 34 1L29 7M21 8q13 3 17 12M36 22l29-1M-20 28q44 6 90 0" />
        <path d="m16 0 12-3m-10 8 16-2m-12 8 17-2M20-4q-14-16-15-5t15 5q9-21 14-12T20-4" />
        <ellipse cx="-4" cy="11" rx="6" ry="4" />
      </g>
    </>
  );
}

function Fingers({ pointer = false }: { pointer?: boolean }) {
  return (
    <Pen
      seed={pointer ? 123 : 122}
      d={pointer
        ? "M-12-4 10-4 13 11 13 21 8 28 7 62Q5 69 1 63L-1 29-8 36Q-13 38-15 33L-22 18Q-26 12-21 10L-10 22-15 8Z"
        : "M-13-5 10-5 14 6 20 18Q23 25 18 27L10 16 14 33Q16 41 11 41L5 24 8 43Q8 49 3 47L-2 27 0 44Q-1 49-5 46L-9 27-10 39Q-13 44-16 38L-18 14Z"}
      shade gap={7.5}
    >
      <path d={pointer ? "M-9 10 6 17M-8 24l11 2M-2 39l6 1" : "M-10 11 5 14M-10 19l14 3M-8 26l9 2"} fill="none" stroke={INK} strokeWidth=".75" />
    </Pen>
  );
}

function Head({ id }: { id: string }) {
  return (
    <>
      <Pen d="M-23 32-25 65Q-8 84 23 66L17 40Z" seed={126} shade gap={5} />
      <Pen d="M-31-22Q-18-53 10-47Q38-44 37-12L41-2 51 9Q54 13 43 15L44 26Q47 34 36 36Q35 53 15 57L-13 48-27 27Q-44 21-38 5Z" seed={127} shade gap={9}>
        <path d="M-19 29q14 9 19 23M7 43l22-7M-5 29q9 10 17 11" fill="none" stroke={INK} strokeWidth=".65" />
      </Pen>
      <path d="M-28 1Q-44-10-44 7T-25 26L-17 16Q-21 4-28 1Z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <path d="M-28 8q-10-6-9 5l8 5M25-3q10-5 17 0M32 3l8 1M34 5l5 0M40 20l4 1M38 30l6-1" fill="none" stroke={INK} strokeWidth="1.25" />
      <ellipse cx="37" cy="5" rx="1.5" ry="2" fill={INK} />
      <g data-part="mouth" transform={initial.mouth}>
        <path d="M-3-3Q5-5 6 2Q4 10-2 8Z" fill={INK} />
      </g>
      <Pen d="M-35 19Q-49 13-45-3Q-56-11-46-24Q-56-36-42-41Q-48-54-34-57Q-33-70-19-64Q-7-77 4-65Q17-72 23-60Q41-65 40-50Q53-45 43-33Q40-19 24-22L14-31Q9-11-10-5L-14 19-23 23-25 3Z" seed={131} shade gap={2.5} fill="#e2e5e5" />
      <g fill="none" stroke={INK} strokeWidth="1.05">
        {Array.from({ length: 32 }, (_, i) => {
          const x = -39 + (i % 8) * 10 + Math.sin(i * 3) * 3;
          const y = -52 + Math.floor(i / 8) * 12;
          return <path key={i} d={`M${x.toFixed(3)} ${y}q-8-8-2-12t11 1q3 7-4 10m-2-13q8-3 9 5`} />;
        })}
        <path d="M-36-42q7-15 18-17M-6-60q12 6 10 17M21-53q11 9 1 22M-33-9q9-10 10-24" strokeWidth="1.6" />
      </g>
      <path d="M-22 61q18 12 41 0" fill="none" stroke={`url(#${id}-rib)`} />
    </>
  );
}

export function Headphones({ worn = false, id }: { worn?: boolean; id: string }) {
  if (worn) {
    return (
      <g>
        <Pen d="M-36 2Q-53-57-15-64Q14-72 29-44L23-35Q9-62-13-54Q-42-48-27 1Z" seed={133} shade gap={2.5} />
        <Pen d="M-38-1Q-52 2-49 26Q-46 46-32 45L-20 38-19 9-27-1Z" seed={135} shade gap={2.3} />
        <ellipse cx="-34" cy="23" rx="11" ry="18" fill={`url(#${id}-weave)`} stroke={INK} />
        <path d="M-37-42Q-18-68 10-52M-45 8v26" fill="none" stroke={INK} strokeWidth="1.2" />
      </g>
    );
  }
  return (
    <g>
      <Pen d="M-36 14Q-41-58 1-61Q46-64 43 14L34 14Q34-47 2-48Q-29-47-27 15Z" seed={134} shade gap={2.5} />
      <Pen d="M-38 4Q-49 9-47 36Q-45 61-29 58L-18 51-17 15-25 4Z" seed={135} shade gap={2} />
      <Pen d="M32 3Q48 1 51 19L51 43Q47 60 33 58L24 47 24 17Z" seed={136} shade gap={2} />
      <ellipse cx="-32" cy="30" rx="11" ry="22" fill={`url(#${id}-weave)`} stroke={INK} />
      <ellipse cx="39" cy="30" rx="9" ry="20" fill={`url(#${id}-weave)`} stroke={INK} />
      <path d="M-33-35q25-26 56-2M-39 9v39M45 9v38" fill="none" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

export function Character({ id }: { id: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g data-part="backThigh" transform={initial.backThigh}><Trouser id={id} /></g>
      <g data-part="backShin" transform={initial.backShin}><Trouser lower id={id} /></g>
      <g data-part="backShoe" transform={initial.backShoe}><Shoe /></g>
      <g data-part="backUpperArm" transform={initial.backUpperArm}><Sleeve id={id} /></g>
      <g data-part="backForearm" transform={initial.backForearm}><Sleeve lower id={id} /></g>
      <g data-part="backHand" transform={initial.backHand}><Fingers /></g>
      <g data-part="frontThigh" transform={initial.frontThigh}><Trouser id={id} /></g>
      <g data-part="frontShin" transform={initial.frontShin}><Trouser lower id={id} /></g>
      <g data-part="frontShoe" transform={initial.frontShoe}><Shoe /></g>
      <g data-part="pelvis" transform={initial.pelvis}>
        <Pen d="M-46-22Q-13-30 41-22L43 35 9 52-9 36-41 44Z" seed={140} shade gap={2.8} fill="#e3e5e4" />
        <path d="M-36-11 33-11M7-10l2 41M-33-5q3 25 24 21M20-8v10" fill="none" stroke={INK} />
      </g>
      <g data-part="torso" transform={initial.torso}>
        <Pen d="M-21-209Q-39-204-49-191Q-62-165-49-128L-46-78Q-56-44-51-19L-43-2Q-1 13 45-2Q55-14 48-41L48-117Q60-155 40-188L20-204Q0-197-21-209Z" seed={142} shade gap={7.8}>
          <path d="M-21-209Q-39-204-49-191Q-62-165-49-128L-46-78Q-56-44-51-19L-43-2Q-1 13 45-2Q55-14 48-41L48-117Q60-155 40-188L20-204Z" fill={`url(#${id}-cloth)`} stroke="none" />
        </Pen>
        <g stroke={INK} strokeWidth=".9" fill="none">
          <path d="M-26-201q23 18 49-1M-29-197q25 19 54-1M-37-181q17 3 24 24M-41-152q11 34 8 71L-41-41M36-161q-7 36-3 53M-39-29q30 17 71 0m-70 7q35 10 67 2M-23-46l19-14M28-52l-15-11M-44-120l15 18" />
        </g>
        <path d="M-45-14Q0-1 47-14L44 1Q0 15-43 0Z" fill={`url(#${id}-rib)`} stroke={INK} strokeWidth="1" />
      </g>
      <g data-part="head" transform={initial.head}><Head id={id} /></g>
      <g data-part="wornPhones" transform={initial.wornPhones} opacity="0"><Headphones worn id={id} /></g>
      <g data-part="frontUpperArm" transform={initial.frontUpperArm}><Sleeve id={id} /></g>
      <g data-part="frontForearm" transform={initial.frontForearm}><Sleeve lower id={id} /></g>
      <g data-part="frontHand" transform={initial.frontHand}>
        <g data-fingers><Fingers /></g>
        <g data-pointer opacity="0"><Fingers pointer /></g>
      </g>
    </g>
  );
}
