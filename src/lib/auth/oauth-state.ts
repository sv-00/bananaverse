import crypto from "node:crypto";

const oauthStates = new Map<string, { createdAt: number }>();
const STATE_TTL_MS = 5 * 60 * 1000;

function cleanupStates() {
  const now = Date.now();
  for (const [key, val] of oauthStates) {
    if (now - val.createdAt > STATE_TTL_MS) {
      oauthStates.delete(key);
    }
  }
}

export function generateOAuthState(): string {
  const state = crypto.randomBytes(32).toString("hex");
  oauthStates.set(state, { createdAt: Date.now() });
  return state;
}

export function validateOAuthState(state: string): boolean {
  cleanupStates();
  if (oauthStates.has(state)) {
    oauthStates.delete(state);
    return true;
  }
  return false;
}
