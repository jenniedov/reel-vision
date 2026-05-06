import { createServerFn } from "@tanstack/react-start";

const EXTERNAL_URL = "https://xmmwkpndmphziqapnhbk.supabase.co";

export const fetchExternalReels = createServerFn({ method: "GET" }).handler(
  async () => {
    const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
    if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");

    const url =
      `${EXTERNAL_URL}/rest/v1/reels` +
      `?select=*&approved_for_demo=eq.true&blocked=eq.false&order=display_order.asc`;

    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`External reels fetch failed: ${res.status}`);
    return (await res.json()) as Array<Record<string, unknown>>;
  },
);

export const fetchExternalReelsBlocked = createServerFn({ method: "GET" }).handler(
  async () => {
    const key = process.env.EXTERNAL_SUPABASE_ANON_KEY;
    if (!key) throw new Error("Missing EXTERNAL_SUPABASE_ANON_KEY");

    const url =
      `${EXTERNAL_URL}/rest/v1/reels` +
      `?select=*&approved_for_demo=eq.true&blocked=eq.true&order=id.asc`;

    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`External reels fetch failed: ${res.status}`);
    return (await res.json()) as Array<Record<string, unknown>>;
  },
);
