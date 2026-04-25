import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { uploadRateLimit } from "@/lib/rate-limit";
import { logApiError, logSecurityEvent } from "@/lib/logger";

// Types MIME autorisés
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Extensions autorisées
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    // Rate limiting
    try {
      await uploadRateLimit.check(ip, 5); // 5 uploads max par minute
    } catch {
      logSecurityEvent("Upload rate limit exceeded", { ip });
      return NextResponse.json(
        { success: false, error: "Trop d'uploads. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "Aucun fichier fourni"
      }, { status: 400 });
    }

    // Vérifier l'extension du fichier
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      logSecurityEvent("Invalid file extension attempt", {
        ip,
        filename: fileName,
        mimetype: file.type
      });
      return NextResponse.json({
        success: false,
        error: "Extension de fichier non autorisée"
      }, { status: 400 });
    }

    // Sécurité : Type MIME strict (images uniquement)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      logSecurityEvent("Invalid MIME type attempt", {
        ip,
        mimetype: file.type
      });
      return NextResponse.json({
        success: false,
        error: "Type de fichier non autorisé"
      }, { status: 400 });
    }

    // Sécurité : Taille max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        success: false,
        error: "Le fichier dépasse la limite de 5MB"
      }, { status: 400 });
    }

    // Vérifier la signature du fichier (magic numbers)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vérifier les magic numbers pour les images
    const isValidImage = validateImageSignature(buffer, file.type);
    if (!isValidImage) {
      logSecurityEvent("Invalid image signature", { ip, mimetype: file.type });
      return NextResponse.json({
        success: false,
        error: "Fichier image invalide"
      }, { status: 400 });
    }

    // Upload vers Cloudinary avec options de sécurité
    const uploadResponse = await new Promise<{secure_url: string; public_id: string}>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "sts-sofitrans",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "webp", "gif"],
          moderation: "aws_rek", // Modération AWS Rekognition
          phash: true, // Perceptual hash pour détecter les doublons
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as {secure_url: string; public_id: string});
          else reject(new Error("Upload failed"));
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    }, { status: 200 });

  } catch (error: unknown) {
    logApiError("/api/upload", error, { method: "POST", ip });

    return NextResponse.json({
      success: false,
      error: "Erreur lors de l'upload du fichier"
    }, { status: 500 });
  }
}

// Vérifier la signature des fichiers images
function validateImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xFF, 0xD8, 0xFF]],
    "image/png": [[0x89, 0x50, 0x4E, 0x47]],
    "image/gif": [[0x47, 0x49, 0x46, 0x38]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  };

  const sigs = signatures[mimeType];
  if (!sigs) return false;

  return sigs.some(sig =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

// Method Not Allowed
export async function GET() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function PUT() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
