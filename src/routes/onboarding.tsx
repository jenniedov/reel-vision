import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, ShieldOff, Heart, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Welcome to HealthyGram" },
      {
        name: "description",
        content:
          "HealthyGram is a feed that's actually good for you — no doom, no comparison bait.",
      },
    ],
  }),
});

function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    try {
      localStorage.setItem("hg_onboarded", "1");
    } catch {
      // ignore
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white">
      <div className="mx-auto flex h-[100dvh] w-full max-w-md md:max-w-[420px] md:py-6">
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-black px-6 md:rounded-3xl md:shadow-2xl md:shadow-black/80 md:ring-1 md:ring-white/10">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-purple-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/15 blur-3xl" />

          {/* Logo + tagline */}
          <div className="relative z-10 mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="mt-5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              HealthyGram
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              your feed, but actually good for you
            </p>
          </div>

          {/* Feature rows */}
          <div className="relative z-10 mt-12 flex flex-col gap-3">
            <FeatureRow
              icon={ShieldOff}
              title="Filters out the noise"
              body="anxiety bait, doom takes, comparison content — gone"
            />
            <FeatureRow
              icon={Heart}
              title="Surfaces what fills you up"
              body="cinematic, educational, wholesome — more of that"
            />
            <FeatureRow
              icon={Clock}
              title="Tuned to your moment"
              body="pre-gym, sunday scaries, free building time"
            />
          </div>

          <div className="flex-1" />

          {/* CTA */}
          <div className="relative z-10 mb-10">
            <button
              type="button"
              onClick={handleStart}
              className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/30 transition-transform active:scale-[0.98]"
            >
              Start scrolling
            </button>
            <p className="mt-3 text-center text-[11px] text-neutral-500">
              No accounts. No tracking. No infinite doom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
      <div className="flex items-start gap-3 rounded-2xl bg-neutral-950 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-0.5 text-xs text-neutral-400">{body}</div>
        </div>
      </div>
    </div>
  );
}
