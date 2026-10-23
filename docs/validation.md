# Validation — Issue 001

## Local production export

The actual static export was served at `/Catalogo_espacial/` and tested in Chromium. `next build` and TypeScript completed successfully. This is browser emulation, not physical-device or Safari certification.

Inspected viewport sizes:

- Desktop: 1440 × 900.
- Phone landscape: 844 × 390.
- Portrait rotation gate: 390 × 844.
- Reduced motion: 844 × 390.

Screenshots cover all nine moments, the three commercial compositions, secondary interlude phrases, storefront relationship sequence, and final return navigation. Individual PNG captures are generated under `docs/screenshots/` (ignored by git); contact sheets are committed alongside this document.

Browser checks cover full-viewport geometry, horizontal overflow, nine sections, local image loading, console/page errors, product changes and details, index links, dialog Escape handling, deep links, reduced motion, orientation changes, hidden secondary text before its cue, and reverse scroll restoring room titles while hiding commercial controls.

Visual corrections during inspection: explicit initial opacity for delayed nested timelines; more legible character spacing; SVG symbols in place of platform-dependent emoji; neutral bedroom photography; compact product detail scrolling for short landscape viewports.

## Motion and phase boundaries

Each scene owns independent named nested GSAP timelines. Character entrances have staggered transform, rotation, scale and opacity. The secondary phrases begin while outgoing primary letters are still departing. Body copy, media masks and product layers have separate cues. The `CameraTimeline` sends normalized narrative progress to `SpatialScenePlaceholder` only; there is no 3D renderer.

## Deployment — verified 2026-10-23

Published at https://inmersoxr.github.io/Catalogo_espacial/.

GitHub Actions run https://github.com/inmersoxr/Catalogo_espacial/actions/runs/39878956884 completed successfully on its second attempt after the owner enabled Pages. Both the build and deploy jobs passed. The deployed application is commit `53147e4390e3570dda19519318a9c6b6fbad39fa`; subsequent documentation commits do not change the application.

The live URL returns HTTP 200 with system TLS verification enabled. Browser checks run against the published HTML, JavaScript, CSS, fonts and images. Chromium in this execution environment does not inherit the session proxy CA, so the test browser receives live HTTPS responses through Playwright's TLS-validating request client. No persistent browser trust changes or disabled TLS checks were used.

Live validation: desktop (1440 × 900), landscape phone (844 × 390), portrait gate and reduced motion. All nine scenes, chapter navigation, reversible scroll, product selection/details, loaded images and console errors are checked. Font loading and copying a product reference are checked separately. Screenshots are visually reviewed.
