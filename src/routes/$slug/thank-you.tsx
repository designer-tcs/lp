import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/$slug/thank-you")({
  head: () => ({
    meta: [
      {
        title: "Thank you | Wellsprings Academy Admissions",
      },
      {
        name: "description",
        content:
          "Thank you for writing to Wellsprings Academy. Our admissions team will reach out shortly.",
      },
      {
        property: "og:title",
        content: "Thank you | Wellsprings Academy Admissions",
      },
    ],
  }),
  component: ThankYou,
});

function Pattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <span className="absolute -left-28 -top-24 size-[28rem] rounded-full border-[36px] border-[var(--sage-200)]" />
      <span className="absolute left-[4%] top-[16%] size-40 rounded-full bg-[var(--sage-200)]/70" />
      <span className="absolute left-[2%] top-[50%] size-[11rem] rounded-[1.75rem] bg-[var(--sun-200)]/55" />
      <span className="absolute -left-10 bottom-[8%] size-52 rounded-full border-[28px] border-[var(--coral-200)]/80" />
      <span className="absolute right-[-8%] top-[10%] size-64 rounded-full bg-[var(--sage-200)]/45" />
      <span className="absolute right-[4%] top-[36%] size-28 rounded-full border-[18px] border-[var(--sun-200)]" />
      <span className="absolute right-[2%] bottom-[12%] size-36 rounded-[1.5rem] bg-[var(--coral-200)]/50" />
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42rem 34rem at 50% 46%, var(--ws-paper) 0%, var(--ws-paper) 42%, transparent 74%)",
        }}
      />
    </div>
  );
}

function ThankYou() {
  const { slug } = useParams({ from: "/$slug/thank-you" });
  return (
    <section id="top" className="relative isolate min-h-[70vh] overflow-hidden bg-[var(--ws-paper)]">
      <Pattern />

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-[1320px] items-center justify-center px-5 py-20 md:px-8 md:py-28">
        <div className="flex max-w-[36rem] flex-col items-center text-center">
          <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.08] text-[var(--ws-ink)]">
            Thank you
          </h1>

          <span
            className="mt-8 inline-flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[var(--coral-600)] text-white shadow-[0_18px_40px_-18px_rgba(207,78,60,0.7)]"
            aria-hidden
          >
            <Check size={36} strokeWidth={2.6} />
          </span>

          <h2 className="mt-8 text-[clamp(1.7rem,3vw,2.35rem)] leading-[1.15] text-[var(--ws-ink)]">
            You&rsquo;re all set.
          </h2>

          <div className="mt-6 space-y-2 text-[17px] leading-[1.7] text-[var(--grey-800)]">
            <p>Greetings from Wellsprings Academy</p>
            <p>Thank you for your interest.</p>
            <p>Our admissions team will get in touch with you shortly.</p>
          </div>

          <p
            className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]"
            aria-hidden
          >
            <span style={{ color: "var(--coral-600)" }}>Think</span>
            <span className="text-[var(--grey-400)]">·</span>
            <span style={{ color: "var(--sun-700)" }}>Build</span>
            <span className="text-[var(--grey-400)]">·</span>
            <span style={{ color: "var(--sage-700)" }}>Belong</span>
          </p>

          <Link
            to="/$slug"
            params={{ slug }}
            className="group mt-10 inline-flex items-center gap-2 border border-[var(--ws-ink)] px-6 py-3.5 text-sm font-medium text-[var(--ws-ink)] transition-colors hover:bg-[var(--ws-ink)] hover:text-[var(--ws-paper)]"
          >
            Back to Wellsprings
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
