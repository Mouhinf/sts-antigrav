import { NextResponse } from "next/server";
import { authRateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/logger";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_EMAIL = "admin@sts.sofitrans.sn";
const ADMIN_PASSWORD = "sts2024";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "sts-admin-key-2024";

function verifyPassword(input: string): boolean {
  const hash = createHmac("sha256", ADMIN_SECRET).update(ADMIN_PASSWORD).digest("hex");
  const inputHash = createHmac("sha256", ADMIN_SECRET).update(input).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(inputHash));
  } catch {
    return false;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    try {
      await authRateLimit.check(ip, 10);
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de tentatives. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    if (email !== ADMIN_EMAIL || !verifyPassword(password)) {
      logSecurityEvent("Failed login attempt", { email, ip });
      return NextResponse.json(
        { success: false, error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const sessionCookie = createHmac("sha256", ADMIN_SECRET).update(`${Date.now()}`).digest("hex");

    const response = NextResponse.json(
      {
        success: true,
        message: "Connexion réussie",
        user: {
          uid: "admin-main",
          email: ADMIN_EMAIL,
          displayName: "Administrateur STS",
        }
      },
      { status: 200 }
    );

    response.cookies.set("sts_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("sts_auth", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Déconnexion réussie" },
    { status: 200 }
  );

  response.cookies.delete("sts_session");
  response.cookies.delete("sts_auth");

  return response;
}