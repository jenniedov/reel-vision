import { createServerFn } from "@tanstack/react-start";
import { queryExternalReels, type ExternalReel } from "./external-reels.server";

export type { ExternalReel, ExternalReelComment } from "./external-reels.server";

export const fetchExternalReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExternalReel[]> =>
    queryExternalReels(
      "approved_for_demo=eq.true&blocked=eq.false&order=display_order.asc",
    ),
);

export const fetchExternalReelsBlocked = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExternalReel[]> =>
    queryExternalReels("approved_for_demo=eq.true&blocked=eq.true&order=id.asc"),
);
