# Spatial Catalog / Issue 001

**How Space Becomes Commerce** — an interactive, landscape editorial for Doctor Brown Labs.

Next.js App Router, React, TypeScript, GSAP and ScrollTrigger. Nine narrative moments, three fictional collections, character-level typography and independent nested motion channels. Photography and fonts are served locally. No shop backend or 3D engine is included.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000 in landscape. Scroll vertically; use the contents or the Index to jump between chapters. Each room includes an “Explore the objects” shortcut, product selection, details and a copyable reference. Prices are fictional USD concept prices.

## Build and deploy

```sh
npm run typecheck
npm run build
```

The production export is `out/`, with `/Catalogo_espacial` as its base path. To preview the actual deployment locally, serve the parent directory with `out` mounted as `Catalogo_espacial`.

GitHub Actions builds and deploys `out` on pushes to `main`. Repository Settings → Pages → Build and deployment must use **GitHub Actions**. The workflow attempts automatic enablement; GitHub may require the repository owner to enable Pages first.

Expected URL: https://inmersoxr.github.io/Catalogo_espacial/

## Narrative architecture

`lib/editorial.ts` contains chapters, room copy and product records. `components/KineticText.tsx` exposes reusable per-character choreography and an intact accessible label. `lib/narrative.ts` creates a chapter controller with named milestones (`arrival`, `read`, `release`, `commerce`, `handoff`) and seven independent channels:

- TitleTimeline: custom character entry, reading pause and exit; secondary phrases overlap outgoing phrases.
- BodyTimeline: words, explanatory copy and captions.
- LayoutTimeline: changing columns, geometric surfaces and chapter-specific composition.
- MediaTimeline: masks, image scale and the return to full-bleed imagery.
- ProductTimeline: commercial compositions with an independent hold and exit.
- TransitionTimeline: chapter handoffs.
- CameraTimeline: a normalized progress clock only, reserved for phase 2.

The master timeline is scroll-scrubbed and reversible. Native `position: sticky` keeps each stage at `100vw × 100dvh`. No virtual scrolling or wheel interception. The clocks overlap intentionally; text never depends on timers to track scroll position. GSAP matchMedia/context cleanup handles reduced-motion changes and React lifecycle.

`SpatialScenePlaceholder` exposes `SpatialSceneHandle.setNarrativeProgress(0…1)` and an optional `onNarrativeProgress` adapter. Replace its photographic renderer with a Gaussian Splat renderer in phase 2 without changing editorial layers. No simulated camera movement or 3D dependencies are present.

## Accessibility and validation

Landscape is required; portrait shows an animated rotation instruction. Reduced-motion preference produces complete static editorial compositions, keeps products operable, and disables the intro/rotation animation. Semantic headings, visible keyboard focus, native modal focus trapping, Escape dismissal, intact text labels and inert hidden product controls are included.

Run `npm run test:e2e` against the local static preview. The browser suite captures every chapter at desktop and phone landscape sizes, checks reverse scroll, product selection, hash navigation, reduced motion, portrait, image loading and console errors. See `docs/validation.md` for actual inspection results.

## Reference and image credits

CNSRC (`cebx3001/CNSRC`) was consulted read-only: `app/page.tsx`, `KineticText`, ScrollTrigger and sticky scenes in `app/globals.css`. This project uses its own editorial identity, data, composition and controller.

Temporary interior photography from Unsplash, downloaded locally for reliable deployment:

- Living: image endpoint ID photo-1600210492486-724fe5c67fb0
- Bedroom: image endpoint ID photo-1616594039964-ae9021a400a0
- Dining: image endpoint ID photo-1617806118233-18e1de247200
- Source endpoints: `https://images.unsplash.com/{image-id}`. Unsplash license: https://unsplash.com/license

Photos are temporary editorial environment references; fictional product records are not claims about pictured manufacturers. Inter Tight is distributed by Fontsource under the SIL Open Font License (license included in its npm package).
