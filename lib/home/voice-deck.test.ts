import { beforeEach, describe, expect, it } from "vitest";
import { homeRuntimeSources } from "./runtime-sources.generated";

type DeckApi = {
  getVisibleCardCount(width: number, length: number): number;
  getDeckOffset(index: number, active: number, length: number): number;
  getDeckLayout(offset: number, length: number, width: number, cardWidth: number): {x: number; y: number; rotate: number; scale: number; layer: number};
  populateVoiceDeck(track: HTMLElement, catalog: Record<string, string>[]): void;
};
const moduleResult = { exports: {} as DeckApi };
new Function("module", "window", homeRuntimeSources[3]!)(moduleResult, undefined);
const deck = moduleResult.exports;

describe("voice deck arc", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("shows five filled cards on desktop and three on a narrow screen", () => {
    expect(deck.getVisibleCardCount(1200, 20)).toBe(5);
    expect(deck.getVisibleCardCount(360, 20)).toBe(3);
  });

  it("spreads readable neighbours in perspective and keeps outer cards inside the track", () => {
    const center = deck.getDeckLayout(0, 5, 1200, 280);
    const side = deck.getDeckLayout(1, 5, 1200, 280);
    const outer = deck.getDeckLayout(2, 5, 1200, 280);
    expect(center.rotate).toBe(0);
    expect(side.x).toBeGreaterThan(200);
    expect(side.rotate).toBeLessThan(0);
    expect(side.scale).toBeLessThan(center.scale);
    expect(outer.x + 140 * outer.scale).toBeLessThanOrEqual(600);
    expect(deck.getDeckOffset(0, 19, 20)).toBe(1);
  });

  it("fills every catalogue card with a description and circular audio progress, without a waveform", () => {
    const track = document.createElement("div");
    track.innerHTML = '<article class="figma-voice-card"><p class="figma-voice-role"></p><div class="figma-voice-body"><div class="figma-voice-meta"><a></a><span></span></div><div class="figma-voice-portrait"><img/><button class="voice-play"></button></div><a class="figma-voice-name"></a><a class="figma-voice-price"></a></div></article>';
    deck.populateVoiceDeck(track, Array.from({length:20}, (_, i) => ({name:`Диктор ${i}`,role:"Шрека",image:"/portrait.jpg",audio:`/demo-${i}.mp3`,href:"/profile",description:"Актёр дубляжа и рекламы.",price:"Цена договорная"})));
    expect(track.querySelectorAll(".figma-voice-description")).toHaveLength(20);
    expect(track.querySelectorAll(".voice-progress-ring")).toHaveLength(20);
    expect(track.querySelector(".figma-voice-description")?.textContent).toBe("Актёр дубляжа и рекламы.");
    expect(track.querySelectorAll(".voice-waveform")).toHaveLength(0);
  });
});
