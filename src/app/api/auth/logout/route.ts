import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  await clearAuthCookies();
  return NextResponse.redirect(`${BASE_URL}/login`);
}

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
