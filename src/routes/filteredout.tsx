import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldOff, ChevronLeft } from "lucide-react";
import { ReelsFeed } from "@/components/reels/ReelsFeed";

export const Route = createFileRoute("/filteredout")({
  component: FilteredOut,
  head: () => ({
    meta: [
      { title: "Filtered out — HealthyGram" },
      {
        name: "description",
        content:
          "Reels HealthyGram filtered out so they never reach your feed, with the reason for each.",
      },
    ],
  }),
});

function FilteredOut() {
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">
      <div className="mx-auto flex h-[100dvh] w-full max-w-md md:max-w-[420px] md:py-6">
        <div className="relative h-full w-full overflow-hidden bg-black md:rounded-3xl md:shadow-2xl md:shadow-black/80 md:ring-1 md:ring-white/10">
          {/* Top-left back link */}
          <Link
            to="/"
            className="absolute left-3 top-3 z-30 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/80"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Feed
          </Link>

          {/* Top-center pill — what this view is */}
          <div className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full bg-red-600/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <ShieldOff className="h-3.5 w-3.5" />
              Filtered out
            </span>
          </div>

          <ReelsFeed mode="filtered" />
        </div>
      </div>
    </div>
  );
}
