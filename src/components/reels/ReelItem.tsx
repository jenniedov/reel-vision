import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Repeat2,
  BadgeCheck,
} from "lucide-react";
import type { Reel } from "@/types/reel";
import { formatCount } from "@/lib/format";
import { CommentsSheet } from "./CommentsSheet";

interface Props {
  reel: Reel;
  active: boolean;
  onOpenComments: () => void;
  commentsOpen: boolean;
  onCloseComments: () => void;
}

export function ReelItem({
  reel,
  active,
  onOpenComments,
  commentsOpen,
  onCloseComments,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.muted = muted;
      v.play().catch(() => {
        // Autoplay with sound blocked → fall back to muted
        setMuted(true);
        v.muted = true;
        v.play().catch(() => {});
      });
    } else {
      v.pause();
    }
  }, [active, muted]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // double tap → like
      setLiked(true);
      setShowHeart(true);
      window.setTimeout(() => setShowHeart(false), 800);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Approximate "shares" with 1/20 of likes for a plausible visual count
  const sharesDisplay = Math.max(1, Math.floor(reel.likes / 20));
  const topComment = reel.top_comments?.[0];

  return (
    <section className="relative h-full w-full snap-start snap-always overflow-hidden bg-black">
      {reel.video_url ? (
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.cover_url ?? undefined}
          loop
          muted={muted}
          playsInline
          autoPlay={active}
          onClick={() => setMuted((m) => !m)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : active ? (
        <iframe
          key={reel.id}
          src={reel.embed_url}
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          scrolling="no"
          className="absolute left-1/2 top-1/2 h-[140%] w-[120%] -translate-x-1/2 -translate-y-1/2 border-0"
          title={`Reel by ${reel.author_username}`}
        />
      ) : reel.cover_url ? (
        <img
          src={reel.cover_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* mute / unmute */}
      {reel.video_url && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="absolute right-3 top-3 z-30 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-black/70"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}

      {/* gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-14 h-80 bg-gradient-to-t from-black/90 to-transparent" />

      {/* topic badge */}
      {reel.topic && (
        <div className="absolute left-3 top-3 z-20 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {reel.topic}
        </div>
      )}

      {/* blocked banner */}
      {reel.blocked && reel.block_reason && (
        <div className="absolute inset-x-3 top-14 z-20 rounded-lg bg-red-600/90 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
          Filtered: {reel.block_reason}
        </div>
      )}

      {/* right action rail (sits above bottom nav) */}
      <div className="absolute bottom-20 right-3 z-20 flex flex-col items-center gap-5 text-white">
        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center gap-1">
          <Heart
            className={`h-8 w-8 drop-shadow-lg ${liked ? "fill-red-500 stroke-red-500" : ""}`}
            strokeWidth={1.8}
          />
          <span className="text-xs font-semibold drop-shadow">
            {formatCount(reel.likes + (liked ? 1 : 0))}
          </span>
        </button>
        <button onClick={onOpenComments} className="flex flex-col items-center gap-1">
          <MessageCircle className="h-8 w-8 drop-shadow-lg" strokeWidth={1.8} />
          <span className="text-xs font-semibold drop-shadow">
            {formatCount(reel.comments_count)}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Repeat2 className="h-8 w-8 drop-shadow-lg" strokeWidth={1.8} />
          <span className="text-xs font-semibold drop-shadow">{formatCount(sharesDisplay)}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7 -rotate-12 drop-shadow-lg" strokeWidth={1.8} />
        </button>
        <button>
          <MoreHorizontal className="h-7 w-7 drop-shadow-lg" strokeWidth={1.8} />
        </button>
        {/* mini cover thumbnail at bottom of rail (IG style) */}
        {reel.cover_url && (
          <div className="mt-1 h-9 w-9 overflow-hidden rounded-md ring-2 ring-white/90">
            <img src={reel.cover_url} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* bottom-left caption */}
      <div className="absolute bottom-16 left-3 right-20 z-20 text-white">
        {/* author row: avatar + name + verified + Follow */}
        <div className="flex items-center gap-2.5">
          {reel.author_profile_pic_url ? (
            <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
              <img
                src={reel.author_profile_pic_url}
                alt=""
                className="h-9 w-9 rounded-full border-[2px] border-black object-cover"
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-neutral-700" />
          )}
          <div className="flex items-center gap-1">
            <div className="text-sm font-semibold">{reel.author_username}</div>
            {reel.author_verified && (
              <BadgeCheck className="h-4 w-4 fill-sky-500 stroke-black" strokeWidth={2.5} />
            )}
          </div>
          <button className="ml-1 rounded-md border border-white/80 px-3 py-1 text-xs font-semibold text-white">
            Follow
          </button>
        </div>

        {reel.caption && (
          <>
            <div
              className={`mt-2 whitespace-pre-wrap text-sm leading-snug ${
                expanded ? "" : "line-clamp-1"
              }`}
            >
              {reel.caption}
            </div>
            {reel.caption.length > 50 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 text-xs font-medium text-neutral-300"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </>
        )}

        {/* "Liked by X and N others" — IG-style social proof */}
        {topComment && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {topComment.profile_pic_url && (
              <div className="flex -space-x-1.5">
                <img
                  src={topComment.profile_pic_url}
                  alt=""
                  className="h-4 w-4 rounded-full border border-black object-cover"
                />
              </div>
            )}
            <span className="text-neutral-200">
              Liked by <span className="font-semibold">{topComment.username}</span> and{" "}
              <span className="font-semibold">{formatCount(reel.likes - 1)} others</span>
            </span>
          </div>
        )}
      </div>

      {/* IG-style bottom nav (non-functional, visual only) */}
      <BottomNav />

      <CommentsSheet
        open={commentsOpen}
        onClose={onCloseComments}
        comments={reel.top_comments || []}
        totalCount={reel.comments_count}
      />
    </section>
  );
}

function BottomNav() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-14 items-center justify-around border-t border-white/10 bg-black px-4 text-white">
      {/* home */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12l9-9 9 9v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {/* search */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      {/* reels (filled play in rounded square) */}
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="M10 9l5 3-5 3z" fill="currentColor" />
      </svg>
      {/* shop / cart */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 8h18l-2 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 8z" strokeLinejoin="round" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </svg>
      {/* profile (small circle) */}
      <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
        <div className="h-full w-full rounded-full bg-neutral-800" />
      </div>
    </div>
  );
}
