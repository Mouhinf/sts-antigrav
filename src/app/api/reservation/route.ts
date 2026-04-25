import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { bookingSchema } from "@/lib/validations";
import { bookingRateLimit } from "@/lib/rate-limit";
import { logApiError } from "@/lib/logger";
import { sanitizeFormInput } from "@/lib/sanitize";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Rate limiting
    try {
      await bookingRateLimit.check(ip, 2); // 2 réservations max par minute
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de réservations. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation Zod
    const validatedData = bookingSchema.parse(body);

    // Sanitization
    const sanitizedData = {
      clientName: sanitizeFormInput(validatedData.clientName, "text"),
      clientEmail: sanitizeFormInput(validatedData.clientEmail, "email"),
      clientPhone: sanitizeFormInput(validatedData.clientPhone, "phone"),
      serviceType: sanitizeFormInput(validatedData.serviceType, "text"),
      notes: validatedData.notes ? sanitizeFormInput(validatedData.notes, "text") : null,
    };

    // Firestore
    await adminDb.collection("bookings").add({
      ...sanitizedData,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate || null,
      createdAt: new Date().toISOString(),
      status: "pending",
      ip: ip.slice(0, 45),
      userAgent: userAgent.slice(0, 200),
    });

    return NextResponse.json({
      success: true,
      message: "Votre réservation a été enregistrée avec succès."
    }, { status: 200 });
  } catch (error: unknown) {
    logApiError("/api/reservation", error, { method: "POST", ip });

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
