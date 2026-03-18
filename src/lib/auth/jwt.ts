import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: "admin" | "dispatcher" | "driver" | "warehouse";
  tokenType: "access" | "refresh";
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set in production");
  }
  console.warn("⚠️ Using insecure default JWT secrets — DO NOT USE IN PRODUCTION");
}

const EFFECTIVE_JWT_SECRET = JWT_SECRET || "dev-only-secret";
const EFFECTIVE_REFRESH_SECRET = JWT_REFRESH_SECRET || "dev-only-refresh-secret";

export function generateAccessToken(user: {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: "admin" | "dispatcher" | "driver" | "warehouse";
}): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role || "dispatcher",
    tokenType: "access",
  };
  return jwt.sign(payload, EFFECTIVE_JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    algorithm: "HS256",
  });
}

export function generateRefreshToken(user: { id: string }): string {
  const payload: Partial<TokenPayload> = {
    id: user.id,
    email: "",
    name: "",
    role: "dispatcher",
    tokenType: "refresh",
  };
  return jwt.sign(payload, EFFECTIVE_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    algorithm: "HS256",
  });
}

export function generateTokenPair(user: {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: "admin" | "dispatcher" | "driver" | "warehouse";
}): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken({ id: user.id }),
  };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, EFFECTIVE_JWT_SECRET) as TokenPayload;
    return decoded.tokenType === "access" ? decoded : null;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, EFFECTIVE_REFRESH_SECRET) as TokenPayload;
    return decoded.tokenType === "refresh" ? decoded : null;
  } catch {
    return null;
  }
}
