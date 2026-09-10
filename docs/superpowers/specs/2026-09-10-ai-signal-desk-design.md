# AI Signal Desk Design

## Goal

Replace the equal-weight AI service card grid with one interactive, task-led workspace. The section should express the product as a connected audio-production system and make the strongest destinations easiest to understand.

## Evidence and hierarchy

Yandex Metrica for 11 August to 10 September 2026 shows the Fish Audio family as the dominant interest, followed by video dubbing, then text-to-speech and the general voice generator. Music and song generation have substantially less traffic. The interface therefore starts in Voice mode, gives Video the second-strongest position, keeps Text as a direct quick path, and combines Music and Song in one mode.

Fish Audio remains visible as a high-interest model destination, but carries a `Скоро` status because the live page is not yet a usable generator. Music and song destinations remain separate links inside one mode. The current route URLs and the all-services hub are preserved.

## Interaction model

The section has four task tabs: `Голос`, `Видео`, `Текст`, and `Музыка`. Selecting a tab updates one central signal stage rather than revealing another card. The stage changes its headline, description, input/output labels, waveform profile, production tracks, primary action, and secondary route.

The tab interface follows the ARIA tab pattern and works with pointer and keyboard activation. Decorative signal graphics are hidden from assistive technology. Visible focus states are required. Motion is subtle and disabled when reduced motion is requested.

## Visual system

The section stays within the existing Kupigolos palette: pale paper, navy ink, and rust accent. Its main object is a wide dark mixing surface with thin signal lines, meters, a waveform, and an output control. A narrow light task selector sits beside it. This creates an asymmetric studio composition instead of another bento grid.

The heading is a single vertical text group. Corners, shadows, and glass effects reuse the restraint of the surrounding homepage. The component is responsive: on smaller screens the task selector becomes a compact two-column control, then the signal flow stacks vertically.

## Content and routes

- Voice: `https://kupigolos.ru/ai/voice/ai-voice-generator`; secondary Fish Audio at `https://kupigolos.ru/ai/fish-audio`.
- Video: `https://kupigolos.ru/ai/dubbing-video`; secondary combined voice-over at `https://kupigolos.ru/ai/voice/ai-voice-over`.
- Text: `https://kupigolos.ru/ai/voice/text-to-speech`; secondary general voice generator.
- Music: primary song generator at `https://kupigolos.ru/ai/music/song-generator`; secondary music generator at `https://kupigolos.ru/ai/music/ai-music-generator`.
- Hub: `https://ai.kupigolos.ru/`.

## Constraints

No new dependency is needed. The interactive boundary stays local to the AI section. Existing homepage sections and generated markup are not changed. Automated, browser, and visual verification are deferred because project instructions require a separate explicit request.
