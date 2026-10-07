import { Link, useRouterState } from "@tanstack/react-router";
import { SECTION_LINKS } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { isColourVariant, landingFromPath } from "@/lib/landings";

export function SectionNav({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = landingFromPath(pathname);
  const to = isColourVariant(pathname) ? "/$slug/v2" : "/$slug";

  return (
    <nav aria-label="Page sections" className={className}>
      {SECTION_LINKS.map((item) => (
        <Link
          key={item.id}
          to={to}
          params={{ slug }}
          hash={item.id}
          activeOptions={{ exact: true, includeHash: true }}
          className={cn(
            "whitespace-nowrap text-[var(--grey-600)] transition-colors hover:text-[var(--ws-ink)]",
            linkClassName,
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
