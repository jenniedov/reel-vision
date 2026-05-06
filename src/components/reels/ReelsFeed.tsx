import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReelItem, type Reel } from "./ReelItem";
import {
  fetchExternalReels,
  fetchExternalReelsBlocked,
} from "@/server/external-reels.functions";

interface Props {
  showFiltered: boolean;
}

export function ReelsFeed({ showFiltered }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reels", showFiltered ? "filtered" : "approved"],
    queryFn: async (): Promise<Reel[]> => {
      const rows = showFiltered
        ? await fetchExternalReelsBlocked()
        : await fetchExternalReels();
      return rows as unknown as Reel[];
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [commentsOpenIndex, setCommentsOpenIndex] = useState<number | null>(null);

  // Track which reel is in view via scroll
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

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const c = containerRef.current;
      if (!c || !data) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.max(0, Math.min(data.length - 1, activeIndex + (e.key === "ArrowDown" ? 1 : -1)));
        c.scrollTo({ top: next * c.clientHeight, behavior: "smooth" });
      } else if (e.key.toLowerCase() === "c") {
        setCommentsOpenIndex((v) => (v === activeIndex ? null : activeIndex));
      } else if (e.key.toLowerCase() === "m") {
        setMuted((v) => !v);
      } else if (e.key === "Escape") {
        setCommentsOpenIndex(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, data]);

  const reels = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-neutral-500">Loading…</div>;
  }
  if (error) {
    return <div className="flex h-full items-center justify-center text-red-400">Failed to load reels</div>;
  }
  if (reels.length === 0) {
    return <div className="flex h-full items-center justify-center text-neutral-500">No reels</div>;
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
      <style>{`.h-full::-webkit-scrollbar{display:none}`}</style>
      {reels.map((reel, i) => (
        <div key={reel.id} className="h-full w-full">
          <ReelItem
            reel={reel}
            active={i === activeIndex}
            muted={muted}
            onToggleMute={() => setMuted((v) => !v)}
            onOpenComments={() => setCommentsOpenIndex(i)}
            commentsOpen={commentsOpenIndex === i}
            onCloseComments={() => setCommentsOpenIndex(null)}
          />
        </div>
      ))}
    </div>
  );
}
