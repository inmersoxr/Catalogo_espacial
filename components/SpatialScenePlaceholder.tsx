"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { basePath } from "@/lib/editorial";
/** Phase 2 boundary: replace this renderer; the editorial controller remains unchanged. */
export interface SpatialSceneHandle {
  setNarrativeProgress: (progress: number) => void;
}
export interface SpatialSceneProps {
  image: string;
  alt: string;
  priority?: boolean;
  onNarrativeProgress?: (progress: number) => void;
}
export const SpatialScenePlaceholder = forwardRef<
  SpatialSceneHandle,
  SpatialSceneProps
>(function SpatialScenePlaceholder(
  { image, alt, priority = false, onNarrativeProgress },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      setNarrativeProgress(value) {
        const progress = Math.max(0, Math.min(1, value));
        if (host.current) host.current.dataset.progress = progress.toFixed(4);
        onNarrativeProgress?.(progress);
      },
    }),
    [onNarrativeProgress],
  );
  return (
    <div className="spatial-media" ref={host} data-progress="0">
      <img
        src={`${basePath}/images/${image}`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
      />
    </div>
  );
});
