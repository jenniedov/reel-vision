const EXTERNAL_URL = "https://xmmwkpndmphziqapnhbk.supabase.co";

export interface ReelComment {
  username: string;
  text: string;
  likes: number;
  replies_count: number;
  timestamp: string;
  profile_pic_url?: string;
}

export interface Reel {
  id: number;
  url: string | null;
  embed_url: string;
  cover_url: string | null;
  caption: string;
  author_username: string;
  author_followers: number;
  likes: number;
  comments_count: number;
  views: number;
  shares: number;
  hashtags: string[];
  topic: string | null;
  top_comments: ReelComment[];
  post_date: string | null;
  blocked: boolean;
  block_reason: string | null;
  display_order: number;
}

export async function queryReels(filter: string): Promise<Reel[]> {
  const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");
  const res = await fetch(`${EXTERNAL_URL}/rest/v1/reels?select=*&${filter}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Reels fetch failed: ${res.status}`);
  return (await res.json()) as Reel[];
}
