"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rooms, chapters, basePath, type Room } from "@/lib/editorial";
import { createNarrative, jumpToChapter } from "@/lib/narrative";
import { KineticText, BodyText } from "./KineticText";
import {
  SpatialScenePlaceholder,
  type SpatialSceneHandle,
} from "./SpatialScenePlaceholder";
import { Arrow, Asterisk, RotateIcon } from "./Icons";
import { ProductComposition } from "./ProductComposition";
function ChapterLink({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        jumpToChapter(id);
      }}
    >
      {children}
    </a>
  );
}
function SceneMeta({ left, right }: { left: string; right: string }) {
  return (
    <div className="scene-meta micro">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
function Wipe() {
  return <div className="transition-wipe" aria-hidden="true" />;
}
function RoomScene({
  room,
  sceneRef,
}: {
  room: Room;
  sceneRef: (handle: SpatialSceneHandle | null) => void;
}) {
  return (
    <section
      id={room.id}
      data-kind="room"
      className={`scene room-scene room-${room.id}`}
      aria-label={room.title.join(" ")}
    >
      <div className="stage">
        <SpatialScenePlaceholder
          ref={sceneRef}
          image={room.image}
          alt={room.alt}
        />
        <div className="room-color" />
        <SceneMeta
          left={`CHAPTER ${room.number} / ${room.title.join(" ")}`}
          right="SPACES TO LIVE IN"
        />
        <div className="room-heading">
          <span className="room-number">{room.number}</span>
          <h2>
            {room.title.map((line) => (
              <KineticText
                key={line}
                text={line}
                choreography={
                  room.id === "living"
                    ? "rise"
                    : room.id === "bedroom"
                      ? "hinge"
                      : "edges"
                }
              />
            ))}
          </h2>
        </div>
        <div className="room-narrative">
          <span className="micro narrative-caption">{room.label}</span>
          <BodyText text={room.body} />
        </div>
        <p className="room-caption narrative-caption">{room.caption}</p>
        <button
          className="explore-link text-button"
          onClick={() => jumpToChapter(room.id, 0.65)}
        >
          Explore the objects{" "}
          <span>
            <Arrow />
          </span>
        </button>
        <ProductComposition room={room} />
        <Wipe />
      </div>
    </section>
  );
}
export default function Catalog() {
  const root = useRef<HTMLElement>(null),
    spatial = useRef<Record<string, SpatialSceneHandle | null>>({});
  const [active, setActive] = useState("cover"),
    [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.current
          ?.querySelectorAll<HTMLElement>(".scene")
          .forEach((section) =>
            createNarrative(section, spatial.current[section.id]),
          );
        gsap.fromTo(
          ".cover-title .char",
          { yPercent: 105, opacity: 0, rotationX: 35 },
          {
            yPercent: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.9,
            stagger: { amount: 0.65, from: "center" },
            ease: "power3.out",
            onComplete: () => {
              ScrollTrigger.refresh();
            },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.current
          ?.querySelectorAll<HTMLElement>(".commerce")
          .forEach((el) => {
            el.inert = false;
            el.removeAttribute("aria-hidden");
          });
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) =>
          root.current?.style.setProperty("--progress", String(self.progress)),
      });
      root.current?.querySelectorAll<HTMLElement>(".scene").forEach((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(section.id);
          },
        }),
      );
    }, root);
    const handleHash = () => {
      const id = location.hash.slice(1);
      if (chapters.some((ch) => ch.id === id)) jumpToChapter(id);
    };
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      handleHash();
    }, 200);
    window.addEventListener("hashchange", handleHash);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
      mm.revert();
      context.revert();
    };
  }, []);
  useLayoutEffect(() => {
    const dialog = menuRef.current;
    if (menuOpen && !dialog?.open) dialog?.showModal();
    if (!menuOpen && dialog?.open) dialog?.close();
  }, [menuOpen]);
  const current = chapters.findIndex((ch) => ch.id === active);
  return (
    <>
      <div className="rotate-screen">
        <span className="micro">SPATIAL CATALOG / ISSUE 001</span>
        <div className="rotate-device" aria-hidden="true">
          <RotateIcon />
        </div>
        <h2>
          A different
          <br />
          point of view.
        </h2>
        <p>
          Rotate your device.
          <br />
          This story unfolds in landscape.
        </p>
        <span className="micro">DOCTOR BROWN LABS</span>
      </div>
      <main ref={root} id="publication">
        <a
          href="#contents"
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            jumpToChapter("contents");
          }}
        >
          Skip to contents
        </a>
        <button
          className="index-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Open chapter navigation"
        >
          <span>INDEX</span>
          <span aria-hidden="true">☰</span>
        </button>
        <section
          id="cover"
          className="scene cover"
          data-kind="cover"
          aria-label="Spatial Catalog Issue 001"
        >
          <div className="stage">
            <div className="cover-photo">
              <img
                src={`${basePath}/images/living.jpg`}
                alt={rooms[0].alt}
                fetchPriority="high"
              />
            </div>
            <SceneMeta
              left="A PUBLICATION BY DOCTOR BROWN LABS"
              right="DESIGN / SPACE / COMMERCE"
            />
            <h1 className="cover-title">
              <KineticText text="SPATIAL" />
              <KineticText text="CATALOG" />
            </h1>
            <div className="cover-note">
              <span className="micro">A NEW PERSPECTIVE ON RETAIL</span>
              <p>
                HOW SPACE
                <br />
                BECOMES
                <br />
                COMMERCE
                <span className="arrow">
                  <Arrow />
                </span>
              </p>
            </div>
            <div className="issue-seal">
              <span>ISSUE</span>
              <strong>001</strong>
              <span>VOL. 01 — 2026</span>
            </div>
            <div className="cover-bottom micro">
              <span>
                THREE ROOMS.
                <br />
                ENDLESS POSSIBILITIES.
              </span>
              <ChapterLink id="contents">
                SCROLL TO EXPLORE <span className="scroll-arrow">↓</span>
              </ChapterLink>
            </div>
            <Wipe />
          </div>
        </section>
        <section
          id="contents"
          className="scene contents"
          data-kind="contents"
          aria-label="Contents"
        >
          <div className="stage">
            <SceneMeta left="IN THIS ISSUE" right="THREE WAYS TO SEE SPACE" />
            <div className="contents-intro">
              <h2>
                <KineticText text="COME" choreography="edges" />
                <KineticText text="ON IN." choreography="edges" />
              </h2>
              <p className="micro">A ROOM IS ONLY THE BEGINNING.</p>
            </div>
            <div className="contents-photo">
              <img src={`${basePath}/images/dining.jpg`} alt={rooms[2].alt} />
              <span className="micro">
                A COLLECTION OF EVERYDAY POSSIBILITIES.
              </span>
            </div>
            <nav className="contents-list" aria-label="Room chapters">
              {rooms.map((room) => (
                <ChapterLink
                  id={room.id}
                  className="contents-row"
                  key={room.id}
                >
                  <span className="micro">{room.number} /</span>
                  <span>{room.title.join(" ")}</span>
                  <span className="row-arrow">
                    <Arrow />
                  </span>
                </ChapterLink>
              ))}
              <ChapterLink id="manifesto" className="contents-foot micro">
                FIRST, A NEW PERSPECTIVE <span>↓</span>
              </ChapterLink>
            </nav>
            <Wipe />
          </div>
        </section>
        <section
          id="manifesto"
          className="scene manifesto editorial"
          data-kind="editorial"
          aria-label="Manifesto"
        >
          <div className="stage">
            <SceneMeta left="THE EDITORIAL / 001" right="A NEW PERSPECTIVE" />
            <div
              className="editorial-shape manifesto-orbit"
              aria-hidden="true"
            />
            <h2 className="editorial-title primary">
              <KineticText text="SPACE IS" choreography="center" />
              <KineticText text="NO LONGER" choreography="center" />
              <KineticText text="JUST A PLACE." choreography="center" />
            </h2>
            <h2 className="editorial-title secondary">
              <KineticText
                text="IT’S A"
                group="secondary"
                choreography="scatter"
              />
              <KineticText
                text="POSSIBILITY."
                group="secondary"
                choreography="scatter"
              />
            </h2>
            <div className="editorial-body">
              <span className="micro narrative-caption">
                THE IDEA IS SIMPLE.
              </span>
              <BodyText text="A three-dimensional environment can become a catalog, a narrative and a point of sale." />
            </div>
            <span className="editorial-folio">01—09</span>
            <Wipe />
          </div>
        </section>
        <RoomScene
          room={rooms[0]}
          sceneRef={(handle) => {
            spatial.current.living = handle;
          }}
        />
        <section
          id="stories"
          className="scene stories editorial"
          data-kind="editorial"
          aria-label="Every object has a story"
        >
          <div className="stage">
            <SceneMeta
              left="BETWEEN THE ROOMS / 01"
              right="OBJECTS WITH CONTEXT"
            />
            <div className="editorial-shape story-disc" aria-hidden="true">
              <Arrow />
            </div>
            <h2 className="editorial-title primary">
              <KineticText text="EVERY OBJECT" choreography="wave" />
              <KineticText text="HAS A STORY." choreography="wave" />
            </h2>
            <h2 className="editorial-title secondary">
              <KineticText
                text="EVERY OBJECT"
                group="secondary"
                choreography="hinge"
              />
              <KineticText
                text="CAN BE SOLD."
                group="secondary"
                choreography="hinge"
              />
            </h2>
            <div className="editorial-body">
              <span className="micro narrative-caption">
                FROM SOMETHING YOU SEE, TO SOMETHING YOU KNOW.
              </span>
              <BodyText text="In a room, an object has a purpose. Give it a name, a material and a price, and discovery becomes a connection." />
            </div>
            <span className="editorial-folio">OBJECT → STORY → DESIRE</span>
            <Wipe />
          </div>
        </section>
        <RoomScene
          room={rooms[1]}
          sceneRef={(handle) => {
            spatial.current.bedroom = handle;
          }}
        />
        <section
          id="storefront"
          className="scene storefront editorial"
          data-kind="editorial"
          aria-label="From space to storefront"
        >
          <div className="stage">
            <SceneMeta
              left="BETWEEN THE ROOMS / 02"
              right="A NEW WAY TO CONNECT"
            />
            <div
              className="editorial-shape storefront-block"
              aria-hidden="true"
            />
            <h2 className="editorial-title primary">
              <KineticText text="FROM SPACE" choreography="scatter" />
              <KineticText text="TO STOREFRONT." choreography="scatter" />
            </h2>
            <div className="editorial-body">
              <BodyText text="The space invites you in. Information brings you closer. Products become possibilities. Commerce is the natural next step." />
            </div>
            <div className="relation">
              <div className="relation-item">
                <span>01</span>SPACE<small>The setting</small>
              </div>
              <b className="relation-item">→</b>
              <div className="relation-item">
                <span>02</span>STORY<small>The connection</small>
              </div>
              <b className="relation-item">→</b>
              <div className="relation-item">
                <span>03</span>OBJECT<small>The discovery</small>
              </div>
              <b className="relation-item">→</b>
              <div className="relation-item">
                <span>04</span>COMMERCE<small>The possibility</small>
              </div>
            </div>
            <span className="editorial-folio">ONE CONTINUOUS EXPERIENCE.</span>
            <Wipe />
          </div>
        </section>
        <RoomScene
          room={rooms[2]}
          sceneRef={(handle) => {
            spatial.current.dining = handle;
          }}
        />
        <section
          id="final"
          className="scene final editorial"
          data-kind="final"
          aria-label="The future of commerce is spatial"
        >
          <div className="stage">
            <SceneMeta
              left="THE NEXT CHAPTER"
              right="THIS IS ONLY THE BEGINNING"
            />
            <div className="editorial-shape final-asterisk" aria-hidden="true">
              <Asterisk />
            </div>
            <h2 className="editorial-title primary">
              <KineticText text="THE FUTURE" choreography="center" />
              <KineticText text="OF COMMERCE" choreography="center" />
              <KineticText text="IS SPATIAL." choreography="center" />
            </h2>
            <div className="editorial-body">
              <BodyText text="A new format for the way we discover, experience and choose. Spatial Catalog turns places into possibilities." />
            </div>
            <div className="final-links">
              <span className="micro">SPATIAL CATALOG / ISSUE 001</span>
              <p>
                New spaces.
                <br />
                New possibilities.
              </p>
              <ChapterLink id="contents" className="final-return">
                Explore the collection again{" "}
                <span>
                  <Arrow />
                </span>
              </ChapterLink>
              <ChapterLink id="cover" className="text-button">
                Back to the cover ↑
              </ChapterLink>
            </div>
            <div className="colophon micro">
              <span>
                CONCEPT & EXPERIENCE
                <br />
                DOCTOR BROWN LABS
              </span>
              <span>
                SPATIAL CATALOG
                <br />
                HOW SPACE BECOMES COMMERCE
              </span>
              <span>
                ISSUE 001
                <br />© 2026
              </span>
            </div>
          </div>
        </section>
        <div className="publication-progress" aria-hidden="true">
          <i />
        </div>
        <div className="page-position micro" aria-hidden="true">
          {String(current + 1).padStart(2, "0")} / 09
        </div>
      </main>
      <dialog
        ref={menuRef}
        className="chapter-dialog"
        onCancel={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div className="chapter-menu">
          <div className="menu-top micro">
            <span>SPATIAL CATALOG / CONTENTS</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close chapter navigation"
            >
              CLOSE ×
            </button>
          </div>
          <nav aria-label="All chapters">
            {chapters.map((ch, i) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                aria-current={active === ch.id ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  jumpToChapter(ch.id);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {ch.label}
                <span>
                  <Arrow />
                </span>
              </a>
            ))}
          </nav>
          <span className="micro">HOW SPACE BECOMES COMMERCE</span>
        </div>
      </dialog>
    </>
  );
}
