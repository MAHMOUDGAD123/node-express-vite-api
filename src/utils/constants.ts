import type { CorsOptions } from "cors";
import type { SessionOptions } from "express-session";

export const COOKIE_SECRET = "mg-secret";
export const SESSION_LIFE = 3 * 60 * 1000; // 3 minutes by default

export const SESSION_OPTIONS: SessionOptions = {
  secret: COOKIE_SECRET,
  saveUninitialized: false,
  resave: false,
  name: "connected",
  cookie: {
    secure: false, // http
    maxAge: SESSION_LIFE,
  },
};

export const CORS_OPTIONS: CorsOptions = {
  origin: [
    // /https:\/\/.+\.netlify\.app/, // PROD (your website)
    /http:\/\/localhost:\d{4}/, // DEV
  ],
  credentials: true,
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200,
};

const CACHE_TTL = 60 * 1000; // 1 minutes by default

export const CACHE: { TTL: number; refreshThreshold: () => number } = {
  TTL: CACHE_TTL,
  refreshThreshold: () => {
    // to update the cache 10 seconds before outdated
    const threshold = 10000;
    return CACHE_TTL - threshold < 0 ? 0 : threshold;
  },
};
