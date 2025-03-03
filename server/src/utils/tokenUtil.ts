import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

interface TokenPayload {
  id: string | number;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const options: SignOptions = {};
  
  return jwt.sign(payload as JwtPayload, secret as Secret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) {
    throw new Error("REFRESH_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn:
      (process.env.REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  return jwt.sign(payload as JwtPayload, secret as Secret, options);
};

export const verifyToken = <T>(token: string, secret: string): T | null => {
  try {
    const decoded = jwt.verify(token, secret as Secret) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};