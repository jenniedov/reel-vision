const EXTERNAL_URL = "https://xmmwkpndmphziqapnhbk.supabase.co";

export interface ExternalReelComment {
  username: string;
  text: string;
  likes: number;
  replies_count: number;
  timestamp: string;
  profile_pic_url?: string;
}

export interface ExternalReel {
  id: number;
  embed_url: string;
  video_url: string | null;
  cover_url: string | null;
  caption: string;
  author_username: string;
  likes: number;
  comments_count: number;
  views: number;
  top_comments: ExternalReelComment[];
  hashtags: string[];
  topic: string | null;
  blocked: boolean;
  block_reason: string | null;
  display_order: number;
}

export async function queryExternalReels(filter: string): Promise<ExternalReel[]> {
  const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");
  const url = `${EXTERNAL_URL}/rest/v1/reels?select=*&${filter}`;
  const res = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`External reels fetch failed: ${res.status}`);
  return (await res.json()) as ExternalReel[];
}
