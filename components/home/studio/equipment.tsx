import { Pen, INK, PAPER, RUST } from "./pen";

function Speaker({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Pen d="M0 0 78 2 79 132 0 128Z" seed={21} shade gap={3.6} />
      <Pen d="M78 2 91-7 91 121 79 132Z" seed={22} shade gap={2} />
      <circle cx="39" cy="84" r="31" fill={PAPER} stroke={INK} strokeWidth="2" />
      <circle cx="39" cy="84" r="25" fill={`url(#${id}-weave)`} stroke={INK} />
      <circle cx="39" cy="84" r="13" fill={PAPER} stroke={INK} />
      <circle cx="39" cy="84" r="9" fill={`url(#${id}-weave)`} stroke={INK} />
      <circle cx="39" cy="26" r="17" fill={PAPER} stroke={INK} />
      <circle cx="39" cy="26" r="10" fill={`url(#${id}-weave)`} stroke={INK} />
      <path d="M10 121h28m8 0h21M5 8v102" stroke={INK} fill="none" />
    </g>
  );
}

function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Pen d="M-37-3 38-3 27 65Q0 76-26 65Z" seed={24} shade gap={3.5} />
      <ellipse cy="-3" rx="38" ry="10" fill={PAPER} stroke={INK} />
      <path d="M0-4q-4-95 16-194M4-70q-27-26-43-32M8-113q30-21 50-26M6-48q24-19 43-23M10-154q-13-18-21-27" stroke={INK} fill="none" strokeWidth="1.2" />
      {[
        "M8-133Q-24-133-43-167Q-4-169 8-133Z",
        "M12-164Q-5-189 20-227Q35-194 12-164Z",
        "M6-91Q-24-83-57-112Q-17-129 6-91Z",
        "M1-41Q-23-36-49-60Q-12-71 1-41Z",
        "M8-111Q17-146 58-157Q60-117 8-111Z",
        "M4-64Q25-98 72-91Q59-64 4-64Z",
        "M2-20Q21-46 60-44Q43-13 2-20Z",
      ].map((d, i) => <Pen key={d} d={d} seed={26 + i} shade gap={2.7} weight={.8} />)}
      <g stroke={INK} strokeWidth=".7" fill="none">
        <path d="M8-133-36-161M12-164l8-54M6-91-50-107M8-111l44-39M4-64l59-23M2-20l50-21" />
        <path d="M-25 9-18 55M-18 14-14 60M26 9l-4 49M-32-2q29 8 64 0" />
      </g>
    </g>
  );
}

function AudioScreen() {
  return (
    <g>
      <Pen d="M224 389 470 397 472 548 220 541Z" seed={36} shade gap={3} />
      <path d="M232 400 460 408 461 535 230 529Z" fill={PAPER} stroke={INK} />
      <path d="M232 412 460 420M269 415v115M290 418v113M234 428l32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1m-32 9 32 1M291 464l169 5M290 495l169 5" stroke={INK} strokeWidth=".6" fill="none" opacity=".7" />
      {Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${291 + i * 6} 421v109`} stroke={INK} strokeWidth=".35" opacity=".25" />)}
      {[447, 484, 518].map((y, track) => (
        <g key={y} stroke={track === 2 ? INK : RUST} strokeWidth="1.3" opacity={track === 2 ? .5 : .9}>
          {Array.from({ length: 82 }, (_, i) => {
            const h = (Math.abs(Math.sin(i * 2.1 + track)) * Math.abs(Math.cos(i * .19)) * 16 + 1) * (track === 2 ? .35 : 1);
            const baseline = y + i * .035;
            return <path key={i} d={`M${293 + i * 2} ${(baseline - h).toFixed(3)}v${(2 * h).toFixed(3)}`} />;
          })}
        </g>
      ))}
      <path d="M234 405h30m7 1h23m7 1h18m25 1h39m8 2h43" stroke={INK} strokeWidth="2" />
      <Pen d="M326 545 363 546 362 572 392 580 303 578 327 569Z" seed={38} shade gap={3} />
    </g>
  );
}

export function Desk({ id }: { id: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g opacity=".38" stroke={INK} strokeWidth=".6">
        {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${38 + i * 24} ${(867 + Math.sin(i * 5) * 7).toFixed(3)}l33-5`} />)}
      </g>
      <Pen d="M74 604 94 606 57 864 37 862Z" seed={40} shade gap={2.2} />
      <Pen d="M600 606 621 606 647 851 628 852Z" seed={41} shade gap={2.2} />
      <Pen d="M102 612 119 614 120 849 104 850Z" seed={42} shade gap={2} />
      <Pen d="M85 696 267 698 270 855 79 849Z" seed={43} shade gap={4} />
      <Pen d="M207 711 266 714 268 775 206 773Z" seed={44} shade gap={3} />
      <Pen d="M205 779 268 782 270 844 204 842Z" seed={45} shade gap={3} />
      <path d="M221 733h29v10h-29zM220 799h32v11h-32z" fill={PAPER} stroke={INK} />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} transform={`translate(${99 + i * 9} 710) rotate(${i % 3 === 0 ? -5 : 1})`}>
          <Pen d="M0 0 7-1 9 126 1 126Z" seed={50 + i} shade gap={2} />
          <path d="M2 9v88m0 7v12" stroke={INK} strokeWidth=".7" />
        </g>
      ))}
      <path d="M383 583C343 694 467 713 393 765S248 726 233 842M436 590Q465 677 383 690" stroke={INK} strokeWidth="1.6" fill="none" />
      <Pen d="M27 593 598 581 663 601 93 628 25 611Z" seed={61} shade gap={3.5} />
      <path d="M29 597 94 614 657 599M104 621l345-14" stroke={INK} fill="none" />
      <Plant x={107} y={527} scale={.8} />
      <Speaker x={135} y={445} id={id} />
      <Speaker x={493} y={446} id={id} />
      <AudioScreen />
      <Pen d="M223 568 433 574 461 597 231 592 205 580Z" seed={63} shade gap={3.5} />
      <path d="M224 572 429 579 444 588 236 584Z" fill={PAPER} stroke={INK} />
      {Array.from({ length: 29 }, (_, i) => <path key={i} d={`M${229 + i * 7} ${572 + i * .23}l9 14`} stroke={INK} strokeWidth=".8" />)}
      {Array.from({ length: 21 }, (_, i) => i % 7 !== 2 && i % 7 !== 6 && <path key={i} d={`M${233 + i * 9.3} ${573 + i * .28}l5 8`} stroke={INK} strokeWidth="3" />)}
      <Pen d="M218 546 304 549 302 566 216 563Z" seed={65} shade gap={4} />
      {[229, 245, 261, 282].map(x => <circle key={x} cx={x} cy="556" r="4" fill={PAPER} stroke={INK} />)}
      <Pen d="M494 582Q485 565 501 561Q521 561 523 578L519 584Z" seed={66} shade gap={5} />
      <path d="M503 563v11M504 560q-20-26-35-8" stroke={INK} fill="none" />
      <Pen d="M87 548 139 550 137 593Q111 601 90 591Z" seed={67} shade gap={6} />
      <path d="M139 558q29-4 20 22q-5 10-22 3M140 565q18-3 11 12l-12 2" fill="none" stroke={INK} />
      <text x="113" y="568" textAnchor="middle" fill={INK} stroke="none" fontSize="8" fontFamily="sans-serif">Хорошие</text>
      <text x="113" y="579" textAnchor="middle" fill={INK} stroke="none" fontSize="8" fontFamily="sans-serif">голоса</text>
      <Pen d="M585 542 614 543 612 575 587 574Z" seed={68} shade gap={4} />
      <path d="m590 544-7-35m14 35 2-45m5 45 13-36m-14 37 4-41m-13 40-1-32" stroke={INK} strokeWidth="2" />
      <Pen d="M541 578 607 577 618 582 543 586Z" seed={69} shade gap={3} />
    </g>
  );
}

export function Chair({ id }: { id: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <Pen d="M642 707 661 710 657 818 640 816Z" seed={71} shade gap={2} />
      <Pen d="M641 800 651 807 725 845 722 855 647 826 569 861 562 852Z" seed={72} shade gap={2.6} />
      <Pen d="M646 812 651 817 666 869 656 872 641 821 502 851 498 842Z" seed={73} shade gap={2.6} />
      <g fill={PAPER} stroke={INK} strokeWidth="1.5">
        {[ [499,850], [562,860], [722,856], [658,872] ].map(([x,y],i) => <g key={i}><ellipse cx={x} cy={y} rx="10" ry="13" fill={`url(#${id}-weave)`} /><ellipse cx={x! + 5} cy={y} rx="7" ry="12" /></g>)}
      </g>
      <Pen d="M517 699Q560 674 696 689L733 711Q702 746 555 738L515 725Z" seed={74} shade gap={2.8} />
      <Pen d="M640 527Q674 501 783 510Q795 512 789 531L752 698Q748 720 722 724L631 713Q613 708 616 687Z" seed={75} shade gap={3.4}>
        <path d="M651 535Q690 517 775 522L740 696Q693 710 633 695Z" fill={`url(#${id}-weave)`} stroke={INK} />
      </Pen>
      <path d="M654 544 625 685M775 532 741 687M632 657q51 19 113 0M637 671q49 12 105-1" fill="none" stroke={INK} strokeWidth="1.3" />
      <Pen d="M530 647 544 647 545 704 533 704Z" seed={76} shade gap={2} />
      <Pen d="M511 635Q505 625 517 622L603 628Q615 632 607 641L525 643Z" seed={77} shade gap={3} />
      <Pen d="M754 629 773 632 756 687 744 685Z" seed={78} shade gap={2.5} />
      <Pen d="M758 615 800 615 806 626 753 630Z" seed={79} shade gap={2.5} />
    </g>
  );
}

export function Microphone({ id }: { id: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M1316 845C1380 886 1482 870 1450 847S1303 870 1190 849" fill="none" stroke={INK} strokeWidth="1.6" />
      <Pen d="M1310 426 1317 426 1314 855 1307 855Z" seed={81} shade gap={2} />
      <Pen d="M1308 723 1318 726 1410 865 1399 869 1311 754 1247 867 1237 863Z" seed={82} shade gap={2.6} />
      <Pen d="M1309 730 1317 732 1335 867 1325 872Z" seed={83} shade gap={2.5} />
      <Pen d="M1304 479 1320 479 1319 496 1304 496Z" seed={84} shade gap={2.1} />
      <Pen d="M1303 671 1320 671 1319 689 1303 689Z" seed={85} shade gap={2} />
      <Pen d="M1268 314Q1285 308 1301 315L1300 395 1268 395Z" seed={86} shade gap={3}>
        <path d="M1271 319 1297 319 1297 370 1271 370Z" fill={`url(#${id}-weave)`} stroke={INK} />
      </Pen>
      <Pen d="M1267 368 1302 368 1300 406 1270 406Z" seed={87} shade gap={3} />
      <path d="M1270 378h30m-29 8h28m-28 12h28M1253 371 1315 376 1303 412 1264 413ZM1253 371l47 35m15-30-48 31M1257 382h52M1284 409v29q30 14 30-11" fill="none" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="1223" cy="356" rx="25" ry="48" transform="rotate(10 1223 356)" fill={PAPER} stroke={INK} strokeWidth="2" />
      <ellipse cx="1223" cy="356" rx="21" ry="44" transform="rotate(10 1223 356)" fill={`url(#${id}-weave)`} stroke={INK} />
      <path d="M1215 403C1222 462 1305 478 1311 445M1219 405C1224 458 1302 471 1307 446" fill="none" stroke={INK} strokeWidth="1.3" />
      <path d="M1285 413C1268 460 1298 492 1272 612S1301 774 1296 845" stroke={INK} strokeWidth="1.2" fill="none" />
      <Pen d="M1384 788 1516 789 1516 857 1383 856Z" seed={89} shade gap={3.5} />
      <path d="M1390 796h119v53h-119zM1430 814h31v15h-31z" fill={PAPER} stroke={INK} />
      {[1391,1506].map(x => <path key={x} d={`M${x} 789v67`} stroke={INK} strokeWidth="4" />)}
      <Plant x={1413} y={703} scale={1.05} />
    </g>
  );
}

export function Ground() {
  return (
    <g fill="none" stroke={INK} strokeLinecap="round">
      <path d="M39 843Q240 848 388 840T765 844L1207 844M1381 845l135 1" strokeWidth="1.3" />
      <path d="m420 862 105-3m302-3 298 2m-212 7 177-2m-535 8 165-1m478-3 218 2" strokeWidth=".6" opacity=".35" />
    </g>
  );
}
