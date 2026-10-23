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

## Deployment

The first production workflow built successfully and uploaded `out`: https://github.com/inmersoxr/Catalogo_espacial/actions/runs/39878956884.

Deployment stopped at the initial Pages activation: `Create Pages site failed. Resource not accessible by integration`. The repository owner needs to select **GitHub Actions** in Settings → Pages → Build and deployment → Source. The connected GitHub tools support source commits but do not expose Pages administration; the workflow token cannot create the site.

The public URL returned HTTP 404 at this stage. Public deployment is **not yet verified**. Once Pages is enabled, rerun the failed deploy job, then check the live page, local images/fonts, navigation and scroll animations.
