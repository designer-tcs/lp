export const SECTION_LINKS = [
  { id: "why", label: "Why" },
  { id: "academics", label: "Academics" },
  { id: "beyond", label: "Beyond" },
  { id: "sports", label: "Sports" },
  { id: "campus", label: "Campus" },
  { id: "visit", label: "Admissions" },
] as const;

export const PILLAR_LINKS = [
  { id: "think", label: "Think", color: "var(--coral-600)" },
  { id: "build", label: "Build", color: "var(--sun-700)" },
  { id: "belong", label: "Belong", color: "var(--sage-700)" },
] as const;

/** Scroll to the URL hash after hydration so campaign links like #visit land correctly. */
export function initHashScroll() {
  if (typeof window === "undefined") return () => {};

  const scrollToCurrentHash = (behavior: ScrollBehavior) => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
  };

  const timeouts = [0, 200, 700].map((ms) =>
    window.setTimeout(() => scrollToCurrentHash("auto"), ms),
  );

  return () => {
    timeouts.forEach((timeout) => window.clearTimeout(timeout));
  };
}
