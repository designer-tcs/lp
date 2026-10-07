import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import logoMark from "@/assets/wellsprings-logo.png";
import { LeadCta } from "@/components/landing/LeadFormModal";
import { SectionNav } from "@/components/landing/SectionNav";
import {
  CAMPUS_ADDRESS,
  CAMPUS_NAME,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/leads/contact";
import { PILLAR_LINKS } from "@/lib/sections";
import { isColourVariant, landingFromPath } from "@/lib/landings";
import { trackWebsiteCall } from "@/lib/leads/tracking";

export function SiteFooter({ showColourVariant = false }: { showColourVariant?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = landingFromPath(pathname);
  const homeTo = isColourVariant(pathname) ? "/$slug/v2" : "/$slug";

  return (
    <footer className="bg-[var(--ws-paper)]">
      <div className="grid h-1.5 grid-cols-3" aria-hidden>
        <span style={{ background: "var(--coral-600)" }} />
        <span style={{ background: "var(--sun-600)" }} />
        <span style={{ background: "var(--sage-600)" }} />
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link to={homeTo} params={{ slug }} hash="top" className="inline-flex" aria-label="Wellsprings Academy">
              <img
                src={logoMark}
                alt="Wellsprings Academy"
                width={180}
                height={64}
                className="h-12 w-auto object-contain md:h-14"
              />
            </Link>
            <p className="mt-6 max-w-[38ch] font-serif text-2xl leading-snug text-[var(--ws-ink)]">
              A CBSE school in Sarjapur where children think, build and belong.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.28em]">
              {PILLAR_LINKS.map((item, index) => (
                <span key={item.id} className="inline-flex items-center gap-3">
                  {index > 0 ? <span className="text-[var(--grey-400)]">·</span> : null}
                  <Link
                    to={homeTo}
                    params={{ slug }}
                    hash={item.id}
                    activeOptions={{ exact: true, includeHash: true }}
                    style={{ color: item.color }}
                    className="hover:opacity-80"
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--grey-600)]">
              Explore
            </p>
            <SectionNav
              className="mt-5 flex flex-col items-start gap-2.5 font-mono text-[12px] uppercase tracking-[0.16em]"
              linkClassName="text-[var(--grey-800)] hover:text-[var(--coral-600)]"
            />
          </div>

          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--grey-600)]">
              Visit the campus
            </p>
            <p className="mt-5 flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--grey-700)]">
              <MapPin size={16} strokeWidth={1.7} className="mt-1 shrink-0 text-[var(--sage-700)]" />
              <span>
                <span className="block font-serif text-xl text-[var(--ws-ink)]">{CAMPUS_NAME}</span>
                {CAMPUS_ADDRESS.map((line) => (
                  <span key={line} className="mt-0.5 block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                onClick={() => trackWebsiteCall(PHONE_TEL)}
                className="inline-flex items-center gap-2 text-sm text-[var(--ws-ink)] hover:text-[var(--coral-600)]"
              >
                <Phone size={15} strokeWidth={1.8} />
                {PHONE_DISPLAY}
              </a>
              <LeadCta
                form="visit"
                className="mt-2 inline-flex items-center gap-2 border border-[var(--ws-ink)] px-5 py-3 text-sm font-medium text-[var(--ws-ink)] transition-colors hover:bg-[var(--ws-ink)] hover:text-[var(--ws-paper)]"
              >
                Book a visit
              </LeadCta>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--grey-300)] pt-6 text-xs text-[var(--grey-600)] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {CAMPUS_NAME} · CBSE affiliated · Nursery to Grade 9
          </p>
          {showColourVariant ? (
            <Link to="/$slug/v2" params={{ slug }} className="hover:text-[var(--ws-ink)]">
              Colour variant
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
