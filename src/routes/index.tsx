import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ReelsFeed } from "@/components/reels/ReelsFeed";

const searchSchema = z.object({
  nodemo: z.union([z.literal("true"), z.literal("false"), z.boolean()]).optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Reels Feed" },
      { name: "description", content: "An Instagram-style vertical reels feed." },
    ],
  }),
});

function Index() {
  const { nodemo } = Route.useSearch();
  const isLive = nodemo === true || nodemo === "true";
  const mode = isLive ? "real" : "demo";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">
      <div className="mx-auto flex h-screen w-full max-w-md md:max-w-[420px] md:py-6">
        <div className="relative h-full w-full overflow-hidden bg-black md:rounded-3xl md:shadow-2xl md:shadow-black/80 md:ring-1 md:ring-white/10">
          {isLive && (
            <div className="absolute left-3 top-3 z-30 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
              ● LIVE — agent feed
            </div>
          )}
          <ReelsFeed mode={mode} />
        </div>
      </div>
    </div>
  );
}
