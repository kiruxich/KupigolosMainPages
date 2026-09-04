# Kupigolos Home Page Design

## Status

Approved for implementation by the user with the message «начинай». The page is a replacement visual world over the current public home-page content.

## Goal

Build a complete responsive static home page for Kupigolos that preserves the current SEO-relevant information architecture, factual copy and conversion paths while offering three selectable minimalist visual concepts.

## Architecture

The deliverable uses `index.html`, `styles.css`, `script.js` and local raster assets. HTML owns the content exactly once. CSS custom properties and a `data-theme` attribute provide three visual worlds without cloning sections. JavaScript progressively enhances theme switching, mobile navigation, scroll reveals and exclusive audio playback.

The page requires no build tool or third-party runtime. Remote public Kupigolos assets may be used for current voice portraits, audio demos, portfolio images, the founder image and client logos. A generated studio photograph provides the new hero visual and ships locally with provenance.

## Content and SEO

Preserve the current title, description, canonical URL, H1 and major H2 section topics. Keep meaningful text for the studio introduction, services, portfolio, calculator, speaker categories, actors, advantages, guarantees, process, founder, reviews, internet ratings, clients, contact details and footer navigation. Keep current public URLs for important actions.

Add semantic landmarks, one H1, ordered heading levels, meaningful links, descriptive alternative text and LocalBusiness structured data using only facts present on the current site. Theme switching must not duplicate text in hidden DOM branches.

## Visual System

The page uses a shared spacing scale, responsive grid, 14px media radius, pill-shaped controls and a single warm-red accent within each mode.

### Quiet Studio

Cold ivory and silver surfaces, deep blue text and restrained red. Large negative space and round speaker portraits create a calm premium tone. Photography is naturally lit and sections rely on spacing more than containers.

### Signal

The default mode. Cool gray surfaces, navy text and brick red. A live waveform is the organizing line. Thin rules, sharp editorial blocks and rectangular portrait crops borrow from broadcast graphics without resembling a dashboard.

### Voices Close Up

Near-black navigation, off-white content and stronger red fields. Hard-cropped monochrome portraits and dense type borrow the discipline of jazz session sleeves. The mode remains contemporary and readable rather than retro.

## First Viewport

A compact single-line header sits above an asymmetric split hero. The left side contains the existing professional-studio headline, concise supporting copy and «Выбрать диктора». The right side contains the local studio microphone photograph. A waveform crosses the lower hero boundary and doubles as the current audio playback state. The three-option concept switcher is visible in the header.

## Section Rhythm

- Speaker catalog: horizontal scroll-snap track with real portraits and audio controls.
- AI services: six exact services in an asymmetric grid, each with a different visual treatment and interaction cue.
- Studio introduction: long SEO copy in a readable disclosure paired with concrete production capabilities.
- Services: asymmetric mixed-scale grid with real service descriptions.
- Portfolio: audio list beside two image-led video cases.
- Calculator: focused conversion band with one action.
- Voice categories: visual mosaic using existing speaker-category assets.
- Advantages: alternating typographic facts and a studio image, not repeated icon cards.
- Guarantees and process: contract blocks and a horizontal action sequence.
- Founder and reviews: image-led founder statement plus a snap carousel of authentic excerpts.
- Ratings and clients: compact rating figures followed by real client logos.
- Contact and footer: direct phone, email, addresses and preserved navigation groups.

## Interaction

The concept switcher updates `data-theme`, `aria-pressed`, the visible concept name and `localStorage`. Switching uses one brief page-level opacity transition. Audio buttons play their associated real demo, pause the previous sample and update the waveform state. Mobile navigation uses an accessible disclosure button. IntersectionObserver reveals only major section groups. All motion stops under `prefers-reduced-motion`.

## Responsive Behavior

At 768px and below, asymmetric grids collapse to one column, navigation becomes a menu, the hero image moves below the CTA, horizontal catalogs remain touch-scrollable and no page-level horizontal overflow is allowed. Touch targets remain at least 44px. At 390px, headings wrap naturally and the theme switcher remains reachable without covering navigation.

## Quality Constraints

No AI-purple gradients, decorative glows, fake dashboards, excessive pills, section numbering, decorative status dots, nested cards or repeated three-column feature rows. The generated hero and every sourced raster carry prompt or origin metadata. The page is checked at 1440px and 390px, then passed through the Impeccable detector once.
