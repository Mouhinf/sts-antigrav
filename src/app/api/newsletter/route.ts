import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { newsletterSchema } from "@/lib/validations";
import { newsletterRateLimit } from "@/lib/rate-limit";
import { logApiError } from "@/lib/logger";
import { sanitizeEmail } from "@/lib/sanitize";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    // Rate limiting
    try {
      await newsletterRateLimit.check(ip, 3); // 3 inscriptions max par minute
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de tentatives. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation Zod
    const { email } = newsletterSchema.parse(body);

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { success: false, error: "Email invalide" },
        { status: 400 }
      );
    }

    // Firestore Admin
    const db = await getAdminDb();
    
    // Vérifier si déjà abonné
    const existing = await db
      .collection("newsletter_subscribers")
      .where("email", "==", sanitizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({
        success: true,
        message: "Vous êtes déjà abonné à notre newsletter !"
      }, { status: 200 });
    }

    await db.collection("newsletter_subscribers").add({
      email: sanitizedEmail,
      subscribedAt: new Date().toISOString(),
      ip: ip.slice(0, 45),
    });

    return NextResponse.json({
      success: true,
      message: "Inscription réussie ! Merci de votre confiance."
    }, { status: 200 });
  } catch (error: unknown) {
    logApiError("/api/newsletter", error, { method: "POST", ip });

    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Email invalide"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Erreur interne du serveur"
    }, { status: 500 });
  }
}

// Method Not Allowed
export async function GET() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function PUT() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
