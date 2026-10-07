import { createFileRoute, redirect } from "@tanstack/react-router";
import { TOP_SLUG } from "@/lib/landings";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$slug",
      params: { slug: TOP_SLUG },
    });
  },
});
