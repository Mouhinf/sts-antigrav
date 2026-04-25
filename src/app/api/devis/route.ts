import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { quoteSchema } from "@/lib/validations";
import { quoteRateLimit } from "@/lib/rate-limit";
import { logApiError } from "@/lib/logger";
import { sanitizeFormInput } from "@/lib/sanitize";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Rate limiting
    try {
      await quoteRateLimit.check(ip, 2); // 2 devis max par minute
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de demandes. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation Zod
    const validatedData = quoteSchema.parse(body);

    // Sanitization
    const sanitizedData = {
      name: sanitizeFormInput(validatedData.name, "text"),
      email: sanitizeFormInput(validatedData.email, "email"),
      phone: sanitizeFormInput(validatedData.phone, "phone"),
      service: sanitizeFormInput(validatedData.service, "text"),
      message: sanitizeFormInput(validatedData.message, "text"),
    };

    // Firestore
    const db = await getAdminDb();
    await db.collection("quotes").add({
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      status: "pending",
      ip: ip.slice(0, 45),
      userAgent: userAgent.slice(0, 200),
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande de devis a été enregistrée avec succès."
    }, { status: 200 });
  } catch (error: unknown) {
    logApiError("/api/devis", error, { method: "POST", ip });

    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Données invalides",
        details: error.errors.map(e => e.message)
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
