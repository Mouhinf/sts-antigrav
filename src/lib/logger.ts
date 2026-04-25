import winston from "winston";

// Logger sécurisé qui ne log jamais de données sensibles en production
const isProduction = process.env.NODE_ENV === "production";
const isServerSide = typeof window === "undefined" && process.env.NODE_ENV !== undefined;

// Fonction pour masquer les données sensibles
const sanitizeLog = (info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo => {
  const sensitiveFields = [
    "password",
    "token",
    "authorization",
    "cookie",
    "email",
    "phone",
    "address",
    "creditCard",
    "cvv",
    "ssn",
    "secret",
    "key",
    "privateKey",
  ];

  const sanitized = { ...info };

  const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        result[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        result[key] = sanitizeObject(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  if (typeof sanitized.message === "object" && sanitized.message !== null) {
    sanitized.message = sanitizeObject(sanitized.message as Record<string, unknown>);
  }

  return sanitized;
};

// Format personnalisé
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format(sanitizeLog)(),
  winston.format.json()
);

// Console format pour développement
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Définir les transports de façon conditionnelle
const transports: winston.transport[] = [];

if (isServerSide) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

// Ajouter console en développement
if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Création du logger
const logger = winston.createLogger({
  level: isProduction ? "warn" : "debug",
  defaultMeta: {
    service: "sts-antigrav",
    environment: process.env.NODE_ENV || "development",
  },
  transports,
});

// Helper pour logger les erreurs API de manière sécurisée
export const logApiError = (
  endpoint: string,
  error: unknown,
  requestInfo?: {
    method?: string;
    ip?: string;
    userAgent?: string;
  }
): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error("API Error", {
    endpoint,
    error: errorMessage,
    stack: isProduction ? undefined : errorStack,
    requestInfo: isProduction
      ? { method: requestInfo?.method }
      : requestInfo,
  });
};

// Helper pour logger les tentatives de sécurité
export const logSecurityEvent = (
  event: string,
  details: Record<string, unknown>
): void => {
  logger.warn("Security Event", {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

export default logger;