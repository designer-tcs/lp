export const TOP_SLUG = "top-cbse-school-sarjapura-bengaluru";
export const BEST_SLUG = "best-cbse-school-sarjapura-bengaluru";

export const LANDING_SLUGS = [TOP_SLUG, BEST_SLUG] as const;

export type LandingSlug = (typeof LANDING_SLUGS)[number];

export function isLandingSlug(value: string): value is LandingSlug {
  return (LANDING_SLUGS as readonly string[]).includes(value);
}

export function landingFromPath(pathname: string): LandingSlug {
  const slug = pathname.split("/").filter(Boolean)[0];
  return slug && isLandingSlug(slug) ? slug : TOP_SLUG;
}

export function isChatLanding(pathname: string) {
  return landingFromPath(pathname) === BEST_SLUG;
}

export function isColourVariant(pathname: string) {
  return pathname.includes("/v2");
}

export function isThankYouPath(pathname: string) {
  return pathname.includes("/thank-you");
}
