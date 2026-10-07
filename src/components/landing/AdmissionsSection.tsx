import { MapPin, Phone } from "lucide-react";
import { VisitForm } from "@/components/landing/LeadForm";
import {
  MAPS_EMBED_SRC,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/leads/contact";
import { trackWebsiteCall } from "@/lib/leads/tracking";

export function AdmissionsSection({ className }: { className: string }) {
  return (
    <section id="visit" className={`px-5 py-20 md:px-8 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ws-paper)]/75">
              Admissions
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] text-[var(--ws-paper)]">
              Admissions open for AY 2027-28
            </h2>
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.24em] text-[var(--sun-300)]">
              Nursery to Grade 9
            </p>
            <p className="mt-6 max-w-[52ch] text-[16.5px] leading-[1.75] text-[var(--ws-paper)]/85">
              We&rsquo;re here to answer your questions and welcome you to our community.
            </p>

            <div className="mt-8 border-t border-[var(--ws-paper)]/20 pt-6">
              <p className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--ws-paper)]/85">
                <MapPin size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[var(--sage-400)]" />
                <span>
                  <span className="block font-serif text-xl text-[var(--ws-paper)]">
                    Wellsprings Academy
                  </span>
                  No. 146/1, 2, 3, Mugalur Village, Sarjapura – Chikka Thirupathi Main Road,
                  <br />
                  Anekal Taluk, Bengaluru, Karnataka 562125.
                </span>
              </p>
              <div className="mt-6">
                <a
                  href={`tel:${PHONE_TEL}`}
                  onClick={() => trackWebsiteCall(PHONE_TEL)}
                  className="inline-flex items-center gap-2 border border-[var(--ws-paper)]/50 px-5 py-3 text-sm transition-colors hover:bg-[var(--ws-paper)] hover:text-[var(--ws-ink)]"
                >
                  <Phone size={15} strokeWidth={1.8} /> Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          <div className="self-start border-t-4 border-[var(--coral-600)] bg-[var(--ws-paper)] p-6 text-[var(--ws-ink)] md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--coral-600)]">
              Campus visit
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl">Book a campus visit</h3>
            <p className="mt-2 text-sm text-[var(--grey-700)]">
              Experience Wellsprings and discover where your child can learn and grow.
            </p>
            <div className="mt-6">
              <VisitForm />
            </div>
          </div>

          <iframe
            title="Wellsprings Academy campus on Google Maps"
            src={MAPS_EMBED_SRC}
            className="h-64 w-full border-0 bg-[var(--ws-paper)] md:h-80 lg:col-span-2 lg:h-[22rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
