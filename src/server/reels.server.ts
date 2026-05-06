import type { Reel } from "@/types/reel";
export type { Reel, ReelComment } from "@/types/reel";

const EXTERNAL_URL = "https://xmmwkpndmphziqapnhbk.supabase.co";

export async function queryReels(filter: string): Promise<Reel[]> {
  const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");
  const res = await fetch(`${EXTERNAL_URL}/rest/v1/reels?select=*&${filter}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Reels fetch failed: ${res.status}`);
  return (await res.json()) as Reel[];
}
