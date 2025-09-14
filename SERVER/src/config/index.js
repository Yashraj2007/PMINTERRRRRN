/**
 * Application configuration module
 * Loads and validates environment variables
 */

const { z } = require("zod")
require("dotenv").config()

// Configuration schema validation
const configSchema = z.object({
  // Server
  PORT: z.string().transform(Number).default("4000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Database
  MONGO_URI: z.string().default("mongodb://localhost:27017/pmis"),
  PG_CONN: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  CLERK_JWT_PUBLIC_KEY: z.string().optional(),

  // External Services
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  // Google Services
  GOOGLE_SHEETS_CREDENTIALS_JSON: z.string().optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().optional(),

  // n8n Integration
  N8N_WEBHOOK_URL: z.string().optional(),
  N8N_WEBHOOK_SECRET: z.string().default("default_webhook_secret"),

  // ML Configuration
  MODEL_STORAGE_PATH: z.string().default("./models"),
  RETRAIN_THRESHOLD: z.string().transform(Number).default("100"),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("60000"),
  RATE_LIMIT_MAX: z.string().transform(Number).default("100"),

  // Monitoring
  SENTRY_DSN: z.string().optional(),

  // CORS
  FRONTEND_URL: z.string().default("http://localhost:3000"),
})

// Parse and validate configuration
const parseConfig = () => {
  try {
    return configSchema.parse(process.env)
  } catch (error) {
    console.error("❌ Invalid configuration:", error.errors)
    process.exit(1)
  }
}

const config = parseConfig()

// Export configuration
module.exports = {
  ...config,

  // Computed values
  isDevelopment: config.NODE_ENV === "development",
  isProduction: config.NODE_ENV === "production",
  isTest: config.NODE_ENV === "test",

  // Database configurations
  mongodb: {
    uri: config.MONGO_URI,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  postgres: config.PG_CONN
    ? {
        connectionString: config.PG_CONN,
        ssl: config.isProduction ? { rejectUnauthorized: false } : false,
      }
    : null,

  redis: config.REDIS_URL
    ? {
        url: config.REDIS_URL,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      }
    : null,

  // JWT configuration
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: "7d",
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    message: "Too many requests from this IP, please try again later.",
  },

  // ML configuration
  ml: {
    modelPath: config.MODEL_STORAGE_PATH,
    retrainThreshold: config.RETRAIN_THRESHOLD,
    features: {
      maxSkills: 50,
      maxDistance: 500, // km
      skillWeights: {
        exact: 1.0,
        fuzzy: 0.7,
        related: 0.5,
      },
    },
  },

  // Notification configuration
  notifications: {
    twilio: {
      accountSid: config.TWILIO_ACCOUNT_SID,
      authToken: config.TWILIO_AUTH_TOKEN,
      fromNumber: config.TWILIO_FROM_NUMBER,
    },
    n8n: {
      webhookUrl: config.N8N_WEBHOOK_URL,
      secret: config.N8N_WEBHOOK_SECRET,
    },
  },
}
