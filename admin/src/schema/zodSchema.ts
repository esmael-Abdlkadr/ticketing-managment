import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string(),
    role: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});
export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
});
export const createEventSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  speaker: z.string().optional(),
  settings: z.object({
    questionLimit: z.number().optional(),
    cooldown: z.number().optional(),
    autoDeleteAfter: z.number().optional(),
  }),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  date: z
    .string()
    .nonempty("Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});
