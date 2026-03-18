export * from "./jwt";
export * from "./cookies";
export * from "./session";

// Admin email whitelist - add authorized emails here
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);

export function isAdminEmail(email: string): boolean {
  if (ADMIN_EMAILS.length === 0) {
    // In development, allow all emails if no whitelist configured
    return process.env.NODE_ENV !== "production";
  }
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
