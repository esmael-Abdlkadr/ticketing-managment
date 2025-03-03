import { Response, Request, NextFunction } from "express";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler";
import HttpError from "../utils/httpError";
import { User } from "../models/user";
import { UserRole } from "../types/types";
import { createUserInviteSchema } from "../validators/validationSchema";
import { generateAccessToken } from "../utils/tokenUtil";
import sendEmail from "../utils/sendEmail";

export const updateMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError("User not authenticated", 401));
    }
    const updateUser = await User.findByIdAndUpdate(req.user?.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updateUser,
    });
  }
);
export const deleteMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError("User not authenticated", 401));
    }
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
    });
  }
);
export const myInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError("User not authenticated", 401));
    }
    res.status(200).json({
      status: "success",
      data: req.user,
    });
  }
);
export const getAllUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  }
);
export const assignRoleToUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { roleName } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role: roleName },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Role assigned successfully",
      data: user,
    });
  }
);

export const inviteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if requester is admin
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      return next(new HttpError("Not authorized to invite users", 403));
    }

    // Validate request data
    const parsedResult = createUserInviteSchema.safeParse(req.body);
    if (!parsedResult.success) {
      const errorMessages = parsedResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }

    const { firstName, lastName, email, role } = parsedResult.data;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new HttpError("User with this email already exists", 400));
      }

      // Generate invite token
      const inviteToken = crypto.randomBytes(32).toString("hex");
      const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      // Create user with pending status
      const user = await User.create({
        firstName,
        lastName,
        email,
        role,
        // departmentId,
        inviteToken,
        inviteExpires,
        emailVerified: false,
        isActive: false, // Will be activated when user completes registration
        password: crypto.randomBytes(16).toString("hex"), // Temporary password, will be replaced
      });

      // Send invitation email
      const inviteUrl = `${process.env.FRONTEND_URL}/complete-registration?token=${inviteToken}`;
      console.log("Invitation URL:", inviteUrl);

      await sendEmail({
        email: user.email,
        subject: "Welcome to SupportSphere - Complete Your Registration",
        template: "invitation",
        date: {
          user: { name: `${user.firstName} ${user.lastName}`, role: user.role },
          inviteUrl,
        },
      });

      res.status(201).json({
        status: "success",
        message: "Invitation sent successfully",
        data: {
          userId: user._id,
          email: user.email,
          expiresAt: inviteExpires,
        },
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      return next(new HttpError("Failed to send user invitation", 500));
    }
  }
);

export const completeRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(new HttpError("Token and password are required", 400));
    }

    // MODIFIED: Include select:false fields explicitly with + prefix
    const user = await User.findOne({ inviteToken: token }).select(
      "+inviteToken +inviteExpires"
    );

    if (!user) {
      console.log("No user found with the provided token");
      return next(new HttpError("Invalid invitation token", 400));
    }

    // If user exists, check if token is expired
    if (!user.inviteExpires || user.inviteExpires < new Date()) {
      return next(new HttpError("Invitation token has expired", 400));
    }

    // Set user's password and activate account
    user.password = password;
    user.emailVerified = true;
    user.isActive = true;
    user.inviteToken = undefined;
    user.inviteExpires = undefined;

    await user.save();

    // Generate access token for immediate login
    const accessToken = generateAccessToken({
      id: user._id.toString(),
    });

    res.status(200).json({
      status: "success",
      message: "Registration completed successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  }
);

export const getOrganizerUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizerId = req.user?.id;

    if (!organizerId) {
      return next(new HttpError("Not authenticated", 401));
    }
    const organizer = await User.findById(organizerId);

    if (!organizer) {
      return next(new HttpError("Organizer not found", 404));
    }
    const isAdmin = organizer.role === UserRole.ADMIN;
    let users;

    // If admin, they can see all users
    if (isAdmin) {
      users = await User.find();
    } else {
      // Find events created by this organizer
      const organizerEvents = organizer.createdTickets || [];
      // Find users who are associated with the organizer's events
      users = await User.find({
        eventCreated: { $in: organizerEvents },
      });
    }

    // Return filtered users
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        ticketCreated: user.createdTickets,
        isActive: user.isActive,
      })),
    });
  }
);
