# Compact AI Directory Design

## Goal

Replace the equal-weight AI service card grid and oversized interactive console with a compact two-column directory. The section should feel native to the light Kupigolos homepage and require no exploration before a user can act.

## Evidence and hierarchy

Yandex Metrica for 11 August to 10 September 2026 shows the Fish Audio family as the dominant interest, followed by video dubbing, then text-to-speech and the general voice generator. Music and song generation have substantially less traffic. The directory therefore highlights Voice, keeps Video second, and presents Text and Music as lighter direct rows.

Fish Audio remains visible inside the Voice row as a high-interest model destination, but carries a `скоро` status because the live page is not yet a usable generator. Music and song destinations remain separate links inside one row. The current route URLs and the all-services hub are preserved.

## Interaction model

Four distinct directions are visible at once in the right column: `ИИ-озвучка`, `Видео`, `Текст`, and `Музыка`. Each full row leads directly to its destination. The left column contains the section explanation, the site's existing `studio-cta` button for the voice generator, Fish Audio, and a quiet link to music without vocals. No tabs, duplicated destinations, state, or client-side JavaScript are required.

Decorative audio graphics are hidden from assistive technology. Every link has a visible focus state, and the hierarchy remains readable without the graphics.

## Visual system

The section stays within the existing Kupigolos palette: pale paper, navy ink, and rust accent. One light two-column surface uses a single central divider, hairline row separators, and restrained circular service icons. It deliberately avoids the previous dark application-like surface and decorative timeline controls.

The heading and primary action occupy the left column while the all-services link anchors the top-right corner. The component is responsive: columns stack on small screens without hiding any destinations. The primary action reuses the existing `studio-cta studio-cta--order` component so it matches buttons elsewhere on the page.

## Content and routes

- Voice: `https://kupigolos.ru/ai/voice/ai-voice-generator`; secondary Fish Audio at `https://kupigolos.ru/ai/fish-audio`.
- Video: `https://kupigolos.ru/ai/dubbing-video`; secondary combined voice-over at `https://kupigolos.ru/ai/voice/ai-voice-over`.
- Text: `https://kupigolos.ru/ai/voice/text-to-speech`; secondary general voice generator.
- Music: primary song generator at `https://kupigolos.ru/ai/music/song-generator`; secondary music generator at `https://kupigolos.ru/ai/music/ai-music-generator`.
- Hub: `https://ai.kupigolos.ru/`.

## Constraints

No new dependency is needed. The interactive boundary stays local to the AI section. Existing homepage sections and generated markup are not changed. Automated, browser, and visual verification are deferred because project instructions require a separate explicit request.
