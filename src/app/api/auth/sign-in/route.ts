import { NextResponse } from "next/server";
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

export function validateOAuthState(state: string): boolean {
  cleanupStates();
  if (oauthStates.has(state)) {
    oauthStates.delete(state);
    return true;
  }
  return false;
}

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  const state = crypto.randomBytes(32).toString("hex");
  oauthStates.set(state, { createdAt: Date.now() });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
