import type { ZodTypeAny } from "zod";
import { debugLog } from "./crm-debug.js";
import { postToCrm, toEnquiryCrmBody, toVisitCrmBody } from "./crm.js";
import { enquiryFormSchema, visitBookingFormSchema } from "./schemas.js";

export type LeadHandlerResult = {
  status: number;
  body: Record<string, unknown>;
};

function validationError(issues: { path: (string | number)[]; message: string }[]): LeadHandlerResult {
  return {
    status: 400,
    body: {
      error: "Validation failed",
      issues: issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    },
  };
}

async function handleLead<T>(options: {
  route: string;
  body: unknown;
  schema: ZodTypeAny;
  toCrmBody: (data: T) => Record<string, string>;
  failureLabel: string;
}): Promise<LeadHandlerResult> {
  debugLog(`POST ${options.route} — raw body`, options.body);

  const parsed = options.schema.safeParse(options.body);
  if (!parsed.success) {
    debugLog("Validation failed", parsed.error.issues);
    return validationError(parsed.error.issues);
  }

  const crmBody = options.toCrmBody(parsed.data as T);
  debugLog(`Mapped CRM body (${options.failureLabel})`, crmBody);

  try {
    await postToCrm(crmBody);
    return { status: 200, body: { success: true } };
  } catch (error) {
    console.error(`[CRM] ${options.failureLabel} failed:`, error);
    return {
      status: 502,
      body: { error: "Unable to submit your request right now. Please try again or call us." },
    };
  }
}

export function handleEnquiryLead(body: unknown): Promise<LeadHandlerResult> {
  return handleLead({
    route: "/api/leads/enquiry",
    body,
    schema: enquiryFormSchema,
    toCrmBody: toEnquiryCrmBody,
    failureLabel: "Enquiry",
  });
}

export function handleVisitBookingLead(body: unknown): Promise<LeadHandlerResult> {
  return handleLead({
    route: "/api/leads/visit-booking",
    body,
    schema: visitBookingFormSchema,
    toCrmBody: toVisitCrmBody,
    failureLabel: "Visit booking",
  });
}
