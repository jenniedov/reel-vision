import { createServerFn } from "@tanstack/react-start";
import type { Reel } from "@/types/reel";

const EXTERNAL_URL = "https://xmmwkpndmphziqapnhbk.supabase.co";

async function queryReels(filter: string): Promise<Reel[]> {
  const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");
  const res = await fetch(`${EXTERNAL_URL}/rest/v1/reels?select=*&${filter}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Reels fetch failed: ${res.status}`);
  return (await res.json()) as Reel[];
}

export const fetchReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.false&order=display_order.asc"),
);

export const fetchBlockedReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.true&order=id.asc"),
);

// All real, non-demo reels the agent has scraped & scored. Most-recent first.
export const fetchRealReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels(
      "approved_for_demo=eq.false&blocked=eq.false&order=created_at.desc&limit=50",
    ),
);
