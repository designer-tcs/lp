import { Link, Outlet, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Phone, CalendarCheck, MessageCircle } from "lucide-react";
import appCss from "../styles.css?url";
import logoMark from "@/assets/wellsprings-logo.png";
import faviconPng from "@/assets/favicon.png?url";
import { initLeadTracking, trackWebsiteCall } from "@/lib/leads/tracking";
import { initHashScroll } from "@/lib/sections";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/leads/contact";
import { LeadCta, LeadFormProvider } from "@/components/landing/LeadFormModal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { isChatLanding, isColourVariant, isThankYouPath, landingFromPath, TOP_SLUG } from "@/lib/landings";
import { loadZohoSalesIq, openZohoChat, unloadZohoSalesIq } from "@/lib/zoho-salesiq";

export { PHONE_DISPLAY, PHONE_TEL } from "@/lib/leads/contact";

const GTM_ID = "GTM-M5JRX5L4";
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="sl-section-num text-[var(--grey-700)]">404</p>
        <h1 className="mt-3 text-5xl">Page not found.</h1>
        <a
          href={`/admission/${TOP_SLUG}`}
          className="mt-6 inline-flex items-center justify-center bg-[var(--ws-ink)] px-5 py-3 text-sm font-medium text-[var(--ws-paper)]"
        >
          Back to Wellsprings
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "author", content: "Wellsprings Academy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: faviconPng },
      { rel: "apple-touch-icon", href: faviconPng },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = landingFromPath(pathname);
  const chatEnabled = isChatLanding(pathname);
  const homeTo = isColourVariant(pathname) ? "/$slug/v2" : "/$slug";

  useEffect(() => {
    initLeadTracking();
    return initHashScroll();
  }, []);

  useEffect(() => {
    if (!chatEnabled) {
      unloadZohoSalesIq();
      return;
    }
    loadZohoSalesIq();
  }, [chatEnabled]);

  return (
    <LeadFormProvider>
      <div className="flex min-h-dvh flex-col bg-[var(--ws-paper)] text-[var(--ws-ink)] max-sm:h-dvh max-sm:overflow-hidden">
        <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--grey-200)] bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-5 py-2.5 md:px-8">
            <Link to={homeTo} params={{ slug }} hash="top" className="flex shrink-0 items-center" aria-label="Wellsprings Academy">
              <img
                src={logoMark}
                alt="Wellsprings Academy"
                width={180}
                height={64}
                decoding="async"
                fetchPriority="high"
                className="h-12 w-auto object-contain md:h-16"
              />
            </Link>

            <div
              className="hidden font-mono text-[12px] uppercase tracking-[0.32em] lg:flex lg:items-center lg:gap-3"
              aria-hidden
            >
              <span style={{ color: "var(--coral-600)" }}>Think</span>
              <span className="text-[var(--grey-400)]">·</span>
              <span style={{ color: "var(--sun-700)" }}>Build</span>
              <span className="text-[var(--grey-400)]">·</span>
              <span style={{ color: "var(--sage-700)" }}>Belong</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${PHONE_TEL}`}
                onClick={() => trackWebsiteCall(PHONE_TEL)}
                className="hidden items-center gap-2 border border-[var(--grey-300)] px-3 py-2.5 text-xs font-medium transition-colors hover:border-[var(--ws-ink)] sm:inline-flex"
              >
                <Phone size={14} strokeWidth={1.8} />
                {PHONE_DISPLAY}
              </a>
              <LeadCta
                form="callback"
                className="inline-flex items-center gap-2 bg-[var(--ws-ink)] px-4 py-2.5 text-xs font-medium text-[var(--ws-paper)] transition-colors hover:bg-[var(--coral-600)] md:text-sm"
              >
                <CalendarCheck size={15} strokeWidth={1.8} />
                Enquire Now
              </LeadCta>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col max-sm:overflow-y-auto max-sm:overscroll-y-contain max-sm:scroll-pt-24">
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter showColourVariant={isColourVariant(pathname)} />
        </div>

        {!isThankYouPath(pathname) ? (
          <MobileCtaBar chatEnabled={chatEnabled} useTelCall={chatEnabled} />
        ) : null}
      </div>
    </LeadFormProvider>
  );
}

function MobileCtaBar({ chatEnabled, useTelCall }: { chatEnabled: boolean; useTelCall: boolean }) {
  const callNowClassName =
    "flex flex-col items-center justify-center gap-1 bg-white px-1 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ws-ink)]";

  return (
    <div
      className={`z-40 grid shrink-0 border-t border-[var(--ws-ink)]/15 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden ${
        chatEnabled ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {useTelCall ? (
        <a
          href={`tel:${PHONE_TEL}`}
          onClick={() => trackWebsiteCall(PHONE_TEL)}
          className={callNowClassName}
          aria-label={`Call ${PHONE_DISPLAY}`}
        >
          <Phone size={14} strokeWidth={1.8} />
          Call now
        </a>
      ) : (
        <LeadCta form="callback" className={callNowClassName}>
          <Phone size={14} strokeWidth={1.8} />
          Call now
        </LeadCta>
      )}
      {chatEnabled ? (
        <button
          type="button"
          onClick={openZohoChat}
          className="flex flex-col items-center justify-center gap-1 bg-[var(--slate-800)] px-1 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white"
        >
          <MessageCircle size={14} strokeWidth={1.8} />
          Chat
        </button>
      ) : null}
      <LeadCta
        form="visit"
        className="flex flex-col items-center justify-center gap-1 bg-[var(--coral-600)] px-1 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white"
      >
        <CalendarCheck size={14} strokeWidth={1.8} />
        Book a visit
      </LeadCta>
    </div>
  );
}
