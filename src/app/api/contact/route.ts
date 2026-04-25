import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { contactSchema } from "@/lib/validations";
import { contactRateLimit } from "@/lib/rate-limit";
import { logApiError } from "@/lib/logger";
import { sanitizeFormInput } from "@/lib/sanitize";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Rate limiting
    try {
      await contactRateLimit.check(ip, 3); // 3 messages max par minute
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de messages. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation Zod
    const validatedData = contactSchema.parse(body);

    // Sanitization des données
    const sanitizedData = {
      name: sanitizeFormInput(validatedData.name, "text"),
      email: sanitizeFormInput(validatedData.email, "email"),
      subject: sanitizeFormInput(validatedData.subject, "text"),
      message: sanitizeFormInput(validatedData.message, "text"),
      phone: validatedData.phone ? sanitizeFormInput(validatedData.phone, "phone") : null,
    };

    // Firestore
    await adminDb.collection("messages").add({
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      status: "new",
      ip: ip.slice(0, 45), // Limite pour stockage
      userAgent: userAgent.slice(0, 200),
    });

    return NextResponse.json({
      success: true,
      message: "Votre message a été envoyé avec succès."
    }, { status: 200 });
  } catch (error: unknown) {
    logApiError("/api/contact", error, { method: "POST", ip });

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
