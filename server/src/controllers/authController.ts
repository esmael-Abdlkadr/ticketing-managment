import { Response, Request, NextFunction } from "express";
import Crypto from "crypto";
import asyncHandler from "../utils/asyncHandler";
import HttpError from "../utils/httpError";
import { User } from "../models/user";
import { generateAccessToken, verifyToken } from "../utils/tokenUtil";
import { loginSchema, signupSchemma } from "../validators/validationSchema";
import sendEmail from "../utils/sendEmail";
import { generateCode } from "../utils/generator";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = signupSchemma.safeParse(req.body);
    if (!parsedResult.success) {
      const errorMessages = parsedResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }

    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
      role,
    } = parsedResult.data;
    const email = rawEmail.toLowerCase().trim();
    const isUserExist = await User?.findOne({ email });
    if (isUserExist) {
      return next(new HttpError("User already exist", 400));
    }
    try {
      const otp = generateCode(4);
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        otp,
        otpExpires,
      });

      const data = {
        user: { name: user.firstName, email: user.email },
        otp: otp,
      };
      await sendEmail({
        email: user.email,
        subject: "Email Verification",
        template: "activation",
        date: data,
      });
      res.status(201).json({
        status: "success",
        message: "Email sent to your email for verification",
        email: user.email,
      });
    } catch (error) {
      console.error("Error in signup process:", error);
      return next(new HttpError("Failed to create user account", 500));
    }
  }
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email: rawEmail, otp } = req.body;
    if (!rawEmail || !otp) {
      return next(new HttpError("Email and OTP are required", 400));
    }
    const email = rawEmail.toLowerCase().trim();
    try {
      const user = await User.findOne({ email }).select("+otp +otpExpires");

      if (!user) {
        return next(new HttpError("User not found with this email", 404));
      }
      // Check if OTP exists and is not expired
      if (!user.otp || !user.otpExpires) {
        return next(new HttpError("OTP not found or already used", 400));
      }
      // Check if OTP is expired.
      if (user.otpExpires < new Date()) {
        return next(new HttpError("OTP is expired", 400));
      }
      // Mark email as verified
      user.emailVerified = true;

      // Clear OTP fields
      user.otp = undefined;
      user.otpExpires = undefined;

      // Save the user
      await user.save({ validateBeforeSave: false });

      // Simplify this approach - just convert to a plain object
      const userData = user.toObject();

      // Delete sensitive fields
      delete userData.password;
      delete userData.otp;
      delete userData.otpExpires;

      res.status(200).json({
        status: "success",
        message: "Email verified successfully",
        data: userData,
      });
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return next(new HttpError("Verification process failed", 500));
    }
  }
);
export const requestNewOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email: rawEmail } = req.body;
    if (!rawEmail) {
      return next(new HttpError("Email is required", 400));
    }
    const email = rawEmail.toLowerCase().trim();
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(new HttpError("User not found with this email", 404));
      }

      if (user.emailVerified) {
        return next(new HttpError("Email is already verified", 400));
      }
      const newOTP = generateCode(4);
      user.otp = newOTP;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await user.save({ validateBeforeSave: false });
      const data = {
        user: { name: user.firstName, email: user.email },
        otp: newOTP,
      };

      await sendEmail({
        email: user.email,
        subject: "Email Verification - New OTP",
        template: "activation",
        date: data,
      });

      res.status(200).json({
        status: "success",
        message: "New verification code sent to your email",
        email: user.email,
      });
    } catch (err) {
      console.error("Error resending OTP:", err);
      return next(new HttpError("Failed to resend verification code", 500));
    }
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = loginSchema.safeParse(req.body);
    if (!parsedResult.success) {
      const errorMessages = parsedResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }
    const { email, password } = parsedResult.data;
    const user = await User.findOne({ email }).select(
      "+password  +emailVerified"
    );
    if (!user) {
      return next(new HttpError("Invalid email or password", 401));
    }
    if (!user.password) {
      return next(new HttpError("Invalid email or password", 401));
    }
    const isPasswordMatch = await user.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return next(new HttpError("Invalid email or password", 401));
    }
    if (!user.emailVerified) {
      return next(new HttpError("Please verify your email to login", 401));
    }
    const accessToken = generateAccessToken({
      id: user._id as unknown as string | number,
    });
    const { password: _, __v, ...rest } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "login successfully",
      data: { user: rest, accessToken },
    });
  }
);
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;
    const resetToken = Crypto.createHash("sha256").update(token).digest("hex");
    // find user with reset token and check if token is valid.
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return next(new HttpError("Invalid or expired token", 400));
    }
    user.password = password;
    user.passwordResetToken = "";
    // user.passwordResetExpires = undefined;
    await user.save();
    const accessToken = generateAccessToken({
      id: user._id as unknown as string | number,
    });
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      data: { user, accessToken },
    });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new HttpError("No user found with this email", 404));
    }
    // generate reset token.
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // create password reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const data = {
      user: { name: user.firstName, email: user.email },
      resetUrl,
    };
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      template: "passwordreset",
      date: data,
    });
    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  }
);
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new HttpError("You are not logged in", 401));
    }
    if (!process.env.JWT_SECRET) {
      return next(new HttpError("JWT secret is not defined", 500));
    }
    const decoded = (await verifyToken(token, process.env.JWT_SECRET)) as {
      id: string;
    };
    const user = await User?.findById(decoded?.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    req.user = user;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new HttpError("You are not allowed to perform this action", 403)
      );
    }
    next();
  };
};
