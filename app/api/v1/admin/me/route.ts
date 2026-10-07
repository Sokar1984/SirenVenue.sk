import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/modules/content";
import { apiError } from "../../_lib/http";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sv_admin")?.value ?? null;

  let session: { userId: string } | null;
  try {
    session = await getAdminSession(token);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The admin session store is temporarily unavailable.",
    );
  }

  if (!session) {
    return apiError(401, "unauthorized", "Not authenticated.");
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
