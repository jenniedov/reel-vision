import { createServerFn } from "@tanstack/react-start";
import { queryReels, type Reel } from "./reels.server";

export type { Reel, ReelComment } from "./reels.server";

export const fetchReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.false&order=display_order.asc"),
);

export const fetchBlockedReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reel[]> =>
    queryReels("approved_for_demo=eq.true&blocked=eq.true&order=id.asc"),
);
