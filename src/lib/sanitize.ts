import DOMPurify from "isomorphic-dompurify";

// Configuration de DOMPurify pour une sécurité maximale
const purifyConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
  ALLOW_DATA_ATTR: false,
  SANITIZE_DOM: true,
};

/**
 * Sanitize une chaîne de texte pour éviter les injections XSS
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize du HTML riche (pour les descriptions, articles de blog)
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";
  return DOMPurify.sanitize(input, purifyConfig);
}

/**
 * Sanitize un objet entier récursivement
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Détecter si c'est du HTML ou du texte simple
      if (value.includes("<") && value.includes(">")) {
        sanitized[key] = sanitizeHtml(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Valide et sanitize un email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  const sanitized = email.toLowerCase().trim();
  // Regex simple pour validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : "";
}

/**
 * Valide et sanitize un numéro de téléphone (format international)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") return "";
  // Ne garder que les chiffres et le +
  const sanitized = phone.replace(/[^\d+]/g, "");
  // Vérifier une longueur raisonnable (8-15 caractères)
  return sanitized.length >= 8 && sanitized.length <= 15 ? sanitized : "";
}

/**
 * Sanitize un nom/prénom
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== "string") return "";
  // Ne garder que lettres, espaces, tirets et apostrophes
  return name
    .replace(/[^\p{L}\s\-'’]/gu, "")
    .trim()
    .slice(0, 100); // Limite à 100 caractères
}

/**
 * Vérifie si une chaîne contient du SQL injection potentiel
 */
export function containsSqlInjection(input: string): boolean {
  if (!input || typeof input !== "string") return false;

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(\b(OR|AND)\b.*=.*)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(UNION|JOIN|WHERE|HAVING)\b)/i,
    /(\b(SLEEP|BENCHMARK|WAITFOR)\b)/i,
    /('|;|--|\/\*|\*\/|xp_|sp_)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize complète pour les entrées utilisateur des formulaires
 */
export function sanitizeFormInput(input: string, type: "text" | "email" | "phone" | "html" = "text"): string {
  if (!input || typeof input !== "string") return "";

  // Vérifier SQL injection
  if (containsSqlInjection(input)) {
    throw new Error("Invalid input detected");
  }

  switch (type) {
    case "email":
      return sanitizeEmail(input);
    case "phone":
      return sanitizePhone(input);
    case "html":
      return sanitizeHtml(input);
    case "text":
    default:
      return sanitizeText(input);
  }
}
