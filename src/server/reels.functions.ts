import { createServerFn } from "@tanstack/react-start";
import { queryReels } from "./reels.server";
import type { Reel } from "@/types/reel";

export const fetchReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.false&order=display_order.asc"),
);

export const fetchBlockedReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.true&order=id.asc"),
);
