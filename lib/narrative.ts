import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SpatialSceneHandle } from "@/components/SpatialScenePlaceholder";

export type TimelineName =
  | "TitleTimeline"
  | "BodyTimeline"
  | "LayoutTimeline"
  | "MediaTimeline"
  | "ProductTimeline"
  | "TransitionTimeline"
  | "CameraTimeline";
export type TimelineTiming = {
  enter: number;
  entrance: number;
  hold: number;
  exit: number;
  departure: number;
};
export const timing: Record<TimelineName, TimelineTiming> = {
  TitleTimeline: {
    enter: 0.25,
    entrance: 1.5,
    hold: 3.1,
    exit: 5,
    departure: 1.7,
  },
  BodyTimeline: {
    enter: 2,
    entrance: 1.1,
    hold: 2.7,
    exit: 5.8,
    departure: 0.7,
  },
  LayoutTimeline: {
    enter: 0,
    entrance: 2,
    hold: 3.8,
    exit: 5.8,
    departure: 1.4,
  },
  MediaTimeline: { enter: 0, entrance: 2, hold: 5, exit: 10.9, departure: 1.1 },
  ProductTimeline: {
    enter: 6.6,
    entrance: 1,
    hold: 2.8,
    exit: 10.6,
    departure: 0.8,
  },
  TransitionTimeline: {
    enter: 10.7,
    entrance: 1.3,
    hold: 0,
    exit: 12,
    departure: 0,
  },
  CameraTimeline: { enter: 0, entrance: 12, hold: 0, exit: 12, departure: 0 },
};
/** Every channel owns a local clock; the chapter composes them at narrative labels. */
export function createNarrative(
  section: HTMLElement,
  spatial?: SpatialSceneHandle | null,
) {
  const kind = section.dataset.kind;
  const id = section.id;
  const room = kind === "room";
  const cues = {
    read: id === "bedroom" ? 1.6 : id === "dining" ? 2.5 : 2,
    release: id === "bedroom" ? 4.5 : 5,
    commerce:
      id === "bedroom"
        ? 6.2
        : id === "dining"
          ? 6.8
          : timing.ProductTimeline.enter,
  };
  const select = (s: string) => section.querySelectorAll<HTMLElement>(s);
  if (kind !== "cover") gsap.set(select(".kinetic .char"), { opacity: 0 });
  gsap.set(select(".body-word, .narrative-caption, .relation-item"), {
    opacity: 0,
  });
  const channels = Object.fromEntries(
    Object.keys(timing).map((name) => [
      name,
      gsap.timeline({ id: `${id}:${name}` }),
    ]),
  ) as Record<TimelineName, gsap.core.Timeline>;
  const {
    TitleTimeline: title,
    BodyTimeline: body,
    LayoutTimeline: layout,
    MediaTimeline: media,
    ProductTimeline: product,
    TransitionTimeline: transition,
    CameraTimeline: camera,
  } = channels;
  const master = gsap.timeline({
    id: `chapter:${id}`,
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        section.dataset.narrativeProgress = self.progress.toFixed(4);
        const commerce = section.querySelector<HTMLElement>(".commerce");
        if (commerce) {
          const active =
            self.progress > cues.commerce / 12 &&
            self.progress < (cues.commerce + 4.8) / 12;
          commerce.inert = !active;
          commerce.setAttribute("aria-hidden", String(!active));
        }
      },
    },
  });
  master
    .addLabel("arrival", 0)
    .addLabel("read", cues.read)
    .addLabel("release", cues.release)
    .addLabel("commerce", cues.commerce)
    .addLabel("handoff", 10.7);
  select(".kinetic").forEach((node, ni) => {
    const chars = node.querySelectorAll(".char");
    const choreo = node.dataset.choreography;
    const secondary = node.dataset.titleGroup === "secondary";
    const enter = secondary ? 5.0 : kind === "cover" ? 0 : 0.25 + ni * 0.15;
    const leave = secondary ? 10.2 : cues.release + ni * 0.12;
    const from =
      choreo === "center" ? "center" : choreo === "edges" ? "edges" : "start";
    const initial: gsap.TweenVars =
      choreo === "scatter"
        ? {
            x: (i: number) => (i % 2 ? 1 : -1) * (35 + (i % 4) * 14),
            y: (i: number) => ((i % 3) - 1) * 90,
            rotation: (i: number) => (i % 2 ? 1 : -1) * 18,
            scale: 0.65,
            z: -180,
          }
        : choreo === "hinge"
          ? { rotationX: -88, y: 35, z: -100 }
          : choreo === "wave"
            ? { y: (i: number) => 80 + Math.sin(i) * 35, rotationZ: 8 }
            : choreo === "edges"
              ? {
                  x: (i: number) => (i % 2 ? 70 : -70),
                  scaleX: 0.4,
                  rotationY: 70,
                }
              : { yPercent: 110, rotationX: 35, z: -60 };
    if (kind !== "cover")
      title.fromTo(
        chars,
        { ...initial, opacity: 0 },
        {
          x: 0,
          y: 0,
          z: 0,
          yPercent: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          scaleX: 1,
          opacity: 1,
          duration: 1.15,
          stagger: { amount: 0.6, from },
          ease: "power3.out",
        },
        enter,
      );
    title.to(
      chars,
      {
        yPercent: choreo === "hinge" ? 0 : -105,
        x: (i: number) => (choreo === "scatter" ? (i % 2 ? 75 : -75) : 0),
        rotationX: choreo === "hinge" ? 85 : 0,
        rotationZ: (i: number) => (choreo === "wave" ? (i % 2 ? 9 : -9) : 0),
        opacity: 0,
        duration: 0.9,
        stagger: { amount: 0.65, from: from === "center" ? "edges" : "center" },
        ease: "power2.in",
      },
      leave,
    );
  });
  if (select(".body-word").length) {
    body
      .fromTo(
        select(".body-word"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: "power2.out" },
        0,
      )
      .to(
        select(".body-word"),
        { opacity: 0, y: -10, duration: 0.55, stagger: 0.012 },
        3.8,
      );
  }
  if (select(".narrative-caption").length)
    body
      .fromTo(
        select(".narrative-caption"),
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.2,
      )
      .to(select(".narrative-caption"), { opacity: 0, duration: 0.5 }, 3.7);
  if (room) {
    const bedroom = id === "bedroom",
      dining = id === "dining";
    const mask = bedroom
      ? "inset(0% 0% 0% 42%)"
      : dining
        ? "inset(0% 0% 26% 0%)"
        : "inset(0% 0% 0% 31%)";
    media
      .fromTo(
        select(".spatial-media"),
        { clipPath: mask },
        { clipPath: mask, duration: id === "bedroom" ? 4.9 : 5.7 },
      )
      .to(select(".spatial-media"), {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        ease: "power2.inOut",
      });
    media.fromTo(
      select(".spatial-media img"),
      { scale: 1.09 },
      { scale: 1, duration: 7, ease: "none" },
      0,
    );
    layout.to(
      select(".room-color"),
      {
        scaleX: dining ? 1 : 0,
        scaleY: dining ? 0 : 1,
        duration: 1.4,
        ease: "power2.inOut",
      },
      id === "bedroom" ? 4.9 : 5.8,
    );
    product
      .fromTo(
        select(".commerce"),
        { autoAlpha: 0, y: bedroom ? -28 : 30 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
        0,
      )
      .to(select(".commerce"), { autoAlpha: 0, y: -25, duration: 0.7 }, 4.1);
    layout.to(select(".explore-link"), { autoAlpha: 0, duration: 0.5 }, 5.6);
  } else if (kind === "cover") {
    media.to(
      select(".cover-photo"),
      { clipPath: "inset(0% 0% 0% 0%)", duration: 3, ease: "power2.inOut" },
      3.8,
    );
    layout.to(
      select(".cover-note, .cover-bottom, .issue-seal"),
      { opacity: 0, y: -20, duration: 1 },
      4.8,
    );
  } else if (kind === "contents") {
    layout
      .fromTo(
        select(".contents-row"),
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.25, ease: "power3.out" },
        0.5,
      )
      .to(
        select(".contents-row"),
        { x: -30, opacity: 0, duration: 0.7, stagger: 0.12 },
        9.8,
      );
    media.fromTo(
      select(".contents-photo"),
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "power2.out" },
      0,
    );
  } else {
    layout
      .fromTo(
        select(".editorial-shape"),
        { rotation: -45, scale: 0.3 },
        { rotation: 0, scale: 1, duration: 4, ease: "power2.out" },
        0,
      )
      .to(
        select(".editorial-shape"),
        { rotation: 90, scale: 1.25, duration: 5 },
        5,
      );
    if (select(".relation-item").length)
      layout.fromTo(
        select(".relation-item"),
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.4 },
        6.2,
      );
    if (select(".final-links").length)
      layout.fromTo(
        select(".final-links"),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1 },
        6.5,
      );
  }
  // A renderer-independent 0–1 clock. No camera or 3D engine is simulated.
  const clock = { progress: 0 };
  camera.to(clock, {
    progress: 1,
    duration: 12,
    ease: "none",
    onUpdate: () => spatial?.setNarrativeProgress(clock.progress),
  });
  if (kind !== "final")
    transition.fromTo(
      select(".transition-wipe"),
      { scaleY: 0 },
      { scaleY: 1, duration: 1.3, ease: "power2.inOut" },
    );
  master
    .add(title, "arrival")
    .add(body, "read")
    .add(layout, "arrival")
    .add(media, "arrival")
    .add(product, "commerce")
    .add(transition, "handoff")
    .add(camera, "arrival");
  return { master, channels };
}
export function jumpToChapter(id: string, progress = 0.15) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = reduced
    ? 0
    : (el.offsetHeight - window.innerHeight) * progress;
  window.scrollTo({ top: el.offsetTop + offset, behavior: "instant" });
  history.replaceState(null, "", `#${id}`);
  ScrollTrigger.update();
}
