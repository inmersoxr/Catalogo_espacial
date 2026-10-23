import type { CSSProperties } from "react";
export type Choreography =
  "rise" | "center" | "scatter" | "hinge" | "edges" | "wave";
/** Each visible character has its own transform. The accessible label stays intact. */
export function KineticText({
  text,
  className = "",
  choreography = "rise",
  group = "primary",
}: {
  text: string;
  className?: string;
  choreography?: Choreography;
  group?: string;
}) {
  let index = 0;
  return (
    <span
      className={`kinetic ${className}`}
      aria-label={text}
      data-choreography={choreography}
      data-title-group={group}
    >
      {text.split(" ").map((word, wi) => (
        <span className="word" aria-hidden="true" key={wi}>
          {Array.from(word).map((char, ci) => (
            <span
              className="char"
              style={{ "--char-index": index++ } as CSSProperties}
              key={ci}
            >
              {char}
            </span>
          ))}
          {wi < text.split(" ").length - 1 && <span className="space"> </span>}
        </span>
      ))}
    </span>
  );
}
export function BodyText({ text }: { text: string }) {
  return (
    <p className="body-copy" aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span className="body-word" aria-hidden="true" key={i}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
