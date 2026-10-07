const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Dev: empty base → same-origin `/api/leads` (Vite proxies to Express :3001).
 * Production: set VITE_API_BASE_URL to the deployed Express origin, or keep same-origin.
 */
export const LEADS_API = {
  enquiry: `${API_BASE}/api/leads/enquiry`,
  visitBooking: `${API_BASE}/api/leads/visit-booking`,
} as const;
