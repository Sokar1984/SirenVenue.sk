import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashToken, revokeAdminSession } from "@/modules/content";
import { apiError } from "../../_lib/http";

export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sv_admin")?.value ?? null;

  if (token) {
    try {
      await revokeAdminSession(hashToken(token));
    } catch {
      // Always succeed (idempotent); ignore transient DB issues on logout.
    }
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set("sv_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}
