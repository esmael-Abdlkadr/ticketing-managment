import { User } from "../models/user";

export function generateCode(length: number = 4): string {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}
export const generateUsername = async (
  firstName: string,
  lastName: string
): Promise<string> => {
  const baseUsername = `${firstName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")}${lastName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")}`;

  let username = baseUsername;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await User.findOne({
      email: `${username}@yourdomain.com`,
    });
    if (!existingUser) {
      isUnique = true;
    } else {
      username = `${baseUsername}${counter}`;
      counter++;
    }
  }

  return username;
};
