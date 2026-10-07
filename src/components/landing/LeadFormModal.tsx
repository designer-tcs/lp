import { createContext, useContext, useEffect, useState, lazy, Suspense, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { isThankYouPath } from "@/lib/landings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VisitForm = lazy(() =>
  import("@/components/landing/LeadForm").then((m) => ({ default: m.VisitForm })),
);
const CallbackForm = lazy(() =>
  import("@/components/landing/LeadForm").then((m) => ({ default: m.CallbackForm })),
);

export type LeadFormType = "callback" | "visit";

type LeadFormContextValue = {
  openLeadForm: (type: LeadFormType) => void;
};

const LeadFormContext = createContext<LeadFormContextValue | null>(null);

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) throw new Error("useLeadForm must be used within LeadFormProvider");
  return ctx;
}

const COPY: Record<LeadFormType, { title: string; description: string }> = {
  callback: {
    title: "Request a call back",
    description: "Share a few details and our admissions team will call you.",
  },
  visit: {
    title: "Book a campus visit",
    description: "Tell us about your child and we will help you plan a visit.",
  },
};

function FormFallback() {
  return <p className="py-6 text-sm text-[var(--grey-700)]">Loading form…</p>;
}

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<LeadFormType | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (isThankYouPath(pathname)) setType(null);
  }, [pathname]);

  return (
    <LeadFormContext.Provider value={{ openLeadForm: setType }}>
      {children}
      <Dialog open={type !== null} onOpenChange={(open) => { if (!open) setType(null); }}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-lg overflow-visible rounded-none border-[var(--grey-300)] bg-[var(--ws-paper)] p-6 sm:rounded-none">
          {type ? (
            <>
              <DialogHeader className="pr-8 text-left">
                <DialogTitle className="text-2xl md:text-3xl font-medium tracking-normal">
                  {COPY[type].title}
                </DialogTitle>
                <DialogDescription className="text-sm text-[var(--grey-700)]">
                  {COPY[type].description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <Suspense fallback={<FormFallback />}>
                  {type === "callback" ? (
                    <CallbackForm key="callback" />
                  ) : (
                    <VisitForm key="visit" />
                  )}
                </Suspense>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </LeadFormContext.Provider>
  );
}

const ctaBase = "group inline-flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors";
const ctaStyles: Record<string, string> = {
  solid: "bg-[var(--ws-ink)] text-[var(--ws-paper)] hover:bg-[var(--coral-600)]",
  coral: "bg-[var(--coral-600)] text-white hover:bg-[var(--ws-ink)]",
  outline:
    "border border-[var(--ws-ink)] text-[var(--ws-ink)] hover:bg-[var(--ws-ink)] hover:text-[var(--ws-paper)]",
  paper:
    "border border-[var(--ws-paper)]/60 text-[var(--ws-paper)] hover:bg-[var(--ws-paper)] hover:text-[var(--ws-ink)]",
};

export function LeadCta({
  form,
  children,
  variant = "solid",
  className,
}: {
  form: LeadFormType;
  children: ReactNode;
  variant?: keyof typeof ctaStyles;
  className?: string;
}) {
  const { openLeadForm } = useLeadForm();
  return (
    <button
      type="button"
      onClick={() => openLeadForm(form)}
      className={className ?? `${ctaBase} ${ctaStyles[variant]}`}
    >
      {children}
      {!className ? (
        <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
      ) : null}
    </button>
  );
}
