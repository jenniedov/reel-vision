import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ReelsFeed } from "@/components/reels/ReelsFeed";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Reels Feed" },
      { name: "description", content: "An Instagram-style vertical reels feed." },
    ],
  }),
});

function Index() {
  const [showFiltered, setShowFiltered] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">
      <div className="mx-auto flex h-screen w-full max-w-md md:max-w-[420px] md:py-6">
        <div className="relative h-full w-full overflow-hidden bg-black md:rounded-3xl md:shadow-2xl md:shadow-black/80 md:ring-1 md:ring-white/10">
          {/* filter toggle */}
          <button
            onClick={() => setShowFiltered((v) => !v)}
            className={`absolute right-3 top-14 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md transition ${
              showFiltered ? "bg-red-600 text-white" : "bg-white/15 text-white hover:bg-white/25"
            }`}
            aria-label="Toggle filtered reels"
          >
            <Filter className="h-3.5 w-3.5" />
            {showFiltered ? "Filtered" : "Approved"}
          </button>

          <ReelsFeed key={showFiltered ? "f" : "a"} showFiltered={showFiltered} />
        </div>
      </div>
    </div>
  );
}
