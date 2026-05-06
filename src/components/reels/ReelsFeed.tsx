import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReelItem } from "./ReelItem";
import { fetchReels, fetchBlockedReels, fetchRealReels } from "@/lib/reels.functions";

type Mode = "demo" | "filtered" | "real";

interface Props {
  mode?: Mode;
  /** @deprecated use `mode` */
  showFiltered?: boolean;
}

export function ReelsFeed({ mode, showFiltered }: Props) {
  const resolvedMode: Mode = mode ?? (showFiltered ? "filtered" : "demo");
  const { data, isLoading, error } = useQuery({
    queryKey: ["reels", resolvedMode],
    queryFn: () => {
      if (resolvedMode === "real") return fetchRealReels();
      if (resolvedMode === "filtered") return fetchBlockedReels();
      return fetchReels();
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsOpenIndex, setCommentsOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => {
      const idx = Math.round(c.scrollTop / c.clientHeight);
      setActiveIndex(idx);
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, [data]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const c = containerRef.current;
      if (!c || !data) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.max(
          0,
          Math.min(data.length - 1, activeIndex + (e.key === "ArrowDown" ? 1 : -1)),
        );
        c.scrollTo({ top: next * c.clientHeight, behavior: "smooth" });
      } else if (e.key.toLowerCase() === "c") {
        setCommentsOpenIndex((v) => (v === activeIndex ? null : activeIndex));
      } else if (e.key === "Escape") {
        setCommentsOpenIndex(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, data]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        Loading…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-red-400">
        Failed to load reels: {(error as Error).message}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-neutral-400">
        {resolvedMode === "real" ? (
          <>
            <div className="text-base font-semibold text-neutral-300">
              No live reels yet
            </div>
            <div className="mt-2 text-xs">
              Run the agent (<code className="font-mono">python main.py</code>) and
              they'll appear here.
            </div>
          </>
        ) : (
          "No reels"
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="reels-scroll h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
      <style>{`.reels-scroll::-webkit-scrollbar{display:none}`}</style>
      {data.map((reel, i) => (
        <div key={reel.id} className="h-full w-full">
          <ReelItem
            reel={reel}
            active={i === activeIndex}
            onOpenComments={() => setCommentsOpenIndex(i)}
            commentsOpen={commentsOpenIndex === i}
            onCloseComments={() => setCommentsOpenIndex(null)}
          />
        </div>
      ))}
    </div>
  );
}
