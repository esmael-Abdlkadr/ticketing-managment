import bcrpyt from "bcryptjs";
import * as crypto from "node:crypto";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrpyt.hash(password, 12);
  } catch (err: any) {
    throw new Error(`Error hashing password: ${err.message}`);
  }
};

export const comparePassword = async (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> => {
  try {
    return await bcrpyt.compare(candidatePassword, userPassword);
  } catch (err: any) {
    throw new Error(`Error comparing passwords: ${err.message}`);
  }
};

export const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expires = Date.now() + 10 * 60 * 1000;
  return { resetToken, hashedToken, expires };
};
export const generatePassword = (length: number): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
