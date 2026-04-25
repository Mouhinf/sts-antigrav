import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const sessionCookie = cookies().get("sts_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, error: "Non authentifié" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      uid: "admin-main",
      email: "admin@sts.sofitrans.sn",
      displayName: "Administrateur STS",
    },
  });
}