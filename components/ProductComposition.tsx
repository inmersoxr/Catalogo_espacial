"use client";
import { Arrow } from "./Icons";
import { useState } from "react";
import { price, type Room } from "@/lib/editorial";
export function ProductComposition({ room }: { room: Room }) {
  const [selected, setSelected] = useState(0),
    [expanded, setExpanded] = useState(false),
    [copied, setCopied] = useState(false);
  const product = room.products[selected];
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${product.id} | ${product.name} | Ref. ${product.reference} | ${price(product.price)} USD`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
      setExpanded(true);
    }
  }
  return (
    <div className="commerce" aria-label={`${room.title.join(" ")} collection`}>
      <div className="product-feature" aria-live="polite" aria-atomic="true">
        <span className="micro product-eyebrow">
          OBJECT {String(selected + 1).padStart(2, "0")} / {product.category}
        </span>
        <h3>
          {product.name}
          <span>®</span>
        </h3>
        <p className="product-price">
          {price(product.price)}
          <small>USD</small>
        </p>
        <span className="micro product-ref">REF. {product.reference}</span>
      </div>
      <div className="product-information">
        <p className="product-story">{product.description}</p>
        <button
          className="text-button detail-toggle"
          aria-expanded={expanded}
          aria-controls={`${room.id}-details`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Close details −" : "Object details +"}{" "}
        </button>
        <div
          id={`${room.id}-details`}
          className="product-details"
          hidden={!expanded}
        >
          <p>{product.material}</p>
          <p>{product.id} · Concept product</p>
          <button className="text-button" onClick={copy}>
            {copied ? "Reference copied ✓" : "Copy reference"}
          </button>
        </div>
      </div>
      <div
        className="product-selection"
        role="group"
        aria-label="Select an object"
      >
        <span className="micro">IN THIS ROOM</span>
        {room.products.map((p, i) => (
          <button
            key={p.id}
            aria-pressed={i === selected}
            onClick={() => {
              setSelected(i);
              setCopied(false);
            }}
          >
            <span>0{i + 1}</span>
            {p.name}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </button>
        ))}
      </div>
      <span className="concept-note micro">
        AN EDITORIAL COLLECTION / CONCEPT PRICES
      </span>
    </div>
  );
}
