// @/lib/auth.ts
import jwt from "jsonwebtoken";

// The secret key should be stored in environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || "your-fallback-secret-key";

// Interface for decoded token data
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verifies a JWT token and returns the decoded data
 * @param token The JWT token to verify
 * @returns The decoded token payload
 */
export const verifyToken = async (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded as TokenPayload);
    });
  });
};

/**
 * Generates a JWT token for a user
 * @param userData The user data to encode in the token
 * @param expiresIn Token expiration time (default: '24h')
 * @returns A signed JWT token
 */
export const generateToken = (
  userData: { userId: string; email: string; role: string },
  expiresIn: string = "24h"
): string => {
  return jwt.sign(json, JWT_SECRET, { expiresIn });
};

/**
 * Middleware to check if user has required role
 * @param user The user object from token
 * @param requiredRole The role required for access
 * @returns Boolean indicating if user has permission
 */
export const hasRole = (user: TokenPayload, requiredRole: string): boolean => {
  return user.role === requiredRole;
};
