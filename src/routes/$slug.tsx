import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { isLandingSlug } from "@/lib/landings";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLandingSlug(params.slug)) throw notFound();
  },
  component: LandingLayout,
});

function LandingLayout() {
  return <Outlet />;
}
