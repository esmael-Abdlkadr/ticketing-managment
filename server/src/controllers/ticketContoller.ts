import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import HttpError from "../utils/httpError";
import { Ticket } from "../models/ticket";
import { Comment } from "../models/comment";
import {
  ITicket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UserRole,
} from "../types/types";
import { z } from "zod";
import sendEmail from "../utils/sendEmail";
import { User } from "../models/user";

// Define Zod schemas for validation
const createTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.nativeEnum(TicketCategory),
});

const updateTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.nativeEnum(TicketCategory).optional(),
});

const commentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
});

export const createTicket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = createTicketSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }

    const { title, description, priority, category } = validationResult.data;
    if (!req.user?._id) {
      return next(new HttpError("User not authenticated", 401));
    }

    // Create new ticket
    const ticket = new Ticket({
      title,
      description,
      priority: priority || TicketPriority.MEDIUM,
      category,
      createdBy: req.user._id,
    });

    const savedTicket = await ticket.save();
    await savedTicket.populate("createdBy", "firstName lastName email");

    // Format date in a more readable way
    const formattedDate = new Date(savedTicket.createdAt).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // Send email notification with properly structured data
    const ticketUrl = `${process.env.FRONTEND_URL}/tickets/${savedTicket._id}`;
    await sendEmail({
      email: req.user.email,
      subject: "Your Support Ticket Has Been Created",
      template: "ticket-created",
      date: {
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        },
        ticket: {
          id: savedTicket._id,
          status: savedTicket.status,
          title: savedTicket.title,
          priority: savedTicket.priority,
          category: savedTicket.category,
          createdAt: formattedDate,
          description: savedTicket.description,
        },
        ticketUrl,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Ticket created successfully",
      data: savedTicket,
    });
  }
);
export const getTickets = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status, priority, category, search } = req.query;

    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Search functionality
    if (search && typeof search === "string") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // If not admin/manager, only show user's own tickets
    if (
      req.user &&
      !["admin", "manager", "support_agent"].includes(req.user.role)
    ) {
      filter.createdBy = req.user._id;
    }
    // For support agents, show assigned tickets
    else if (
      req.user?.role === "support_agent" &&
      req.user?.assignedDepartment
    ) {
      filter.department = req.user.assignedDepartment;
    }

    // Get total count first
    const total = await Ticket.countDocuments(filter);

    // Set pagination parameters
    const limit = Number(req.query.limit) || 10;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    let page = Number(req.query.page) || 1;
    page = Math.min(Math.max(1, page), totalPages);

    const startIndex = (page - 1) * limit;

    // Only query the database if there are items to return
    let tickets: ITicket[] = [];
    if (total > 0) {
      tickets = await Ticket.find(filter)
        .populate("createdBy", "firstName lastName email")
        .populate({
          path: "comments",
          populate: {
            path: "createdBy",
            select: "firstName lastName email",
          },
        })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);
    }

    res.status(200).json({
      status: "success",
      message:
        page > totalPages
          ? "Requested page exceeds available pages. Showing last available page."
          : "Tickets retrieved successfully",
      count: tickets.length,
      total,
      pagination: {
        page,
        pages: totalPages,
        isFirstPage: page === 1,
        isLastPage: page === totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: tickets,
    });
  }
);

export const getTicketById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "firstName lastName email")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "firstName lastName email",
        },
      });

    if (!ticket) {
      return next(new HttpError("Ticket not found", 404));
    }

    // Check if user has permission to view this ticket
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user.role !== "support_agent" &&
      ticket.createdBy._id !== req.user._id
    ) {
      return next(new HttpError("Not authorized to access this ticket", 403));
    }

    res.status(200).json({
      status: "success",
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  }
);

export const updateTicket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = updateTicketSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }

    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new HttpError("Ticket not found", 404));
    }

    // Check permissions based on role
    if (
      req.user?.role === UserRole.CUSTOMER &&
      ticket.createdBy !== req.user._id
    ) {
      return next(new HttpError("Not authorized to update this ticket", 403));
    }

    // Regular users can only update title and description of their own tickets
    // Admins, managers and support agents can update status and other fields
    const allowedFields: Partial<ITicket> = {};

    if (
      req.user &&
      ["admin", "manager", "support_agent"].includes(req.user.role)
    ) {
      // Staff can update all fields
      const { title, description, status, priority, category } =
        validationResult.data;
      if (title) allowedFields.title = title;
      if (description) allowedFields.description = description;
      if (status) allowedFields.status = status;
      if (priority) allowedFields.priority = priority;
      if (category) allowedFields.category = category;
    } else {
      // Regular users can only update title and description
      const { title, description } = validationResult.data;
      if (title) allowedFields.title = title;
      if (description) allowedFields.description = description;
    }

    // Update ticket
    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: allowedFields },
      { new: true, runValidators: true }
    ).populate("createdBy", "firstName lastName email");

    if (!ticket) {
      return next(new HttpError("Ticket not found after update", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Ticket updated successfully",
      data: ticket,
    });
  }
);

export const deleteTicket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new HttpError("Ticket not found", 404));
    }

    // Only admins or ticket creators can delete tickets
    if (
      req.user &&
      req.user.role !== "admin" &&
      ticket.createdBy !== req.user._id
    ) {
      return next(new HttpError("Not authorized to delete this ticket", 403));
    }

    await Ticket.findByIdAndDelete(req.params.id);

    // Also delete related comments
    await Comment.deleteMany({ ticketId: req.params.id });
    res.status(200).json({
      status: "success",
      message: "Ticket deleted successfully",
    });
  }
);

export const addComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = commentSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return next(new HttpError(errorMessages, 400));
    }

    const { text } = validationResult.data;
    // Check if comment is marked as internal (visible only to staff)
    const isInternal =
      req.body.isInternal === true &&
      ["admin", "manager", "support_agent"].includes(req.user?.role || "");

    // First fetch the ticket without population to check permissions
    const ticketDoc = await Ticket.findById(req.params.id);

    if (!ticketDoc) {
      return next(new HttpError("Ticket not found", 404));
    }

    // Check if user can comment on this ticket - use toString() for ObjectId comparison
    if (
      req.user?.role === UserRole.CUSTOMER &&
      ticketDoc.createdBy !== req.user._id
    ) {
      return next(
        new HttpError("Not authorized to comment on this ticket", 403)
      );
    }

    if (!req.user?._id) {
      return next(new HttpError("User not authenticated", 401));
    }

    // Create new comment
    const comment = new Comment({
      text,
      createdBy: req.user._id,
      ticketId: ticketDoc._id,
      isInternal, // Store whether this is an internal note
    });

    const savedComment = await comment.save();

    // Add comment to ticket's comments array
    ticketDoc.comments.push(savedComment);
    await ticketDoc.save();

    // Get ticket creator info for notification
    const ticketCreator = await User.findById(ticketDoc.createdBy);

    if (!ticketCreator) {
      console.error(`Could not find creator of ticket ${ticketDoc._id}`);
      // Continue processing even if creator not found
    }

    // Return ticket with populated comments
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("createdBy", "firstName lastName email")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "firstName lastName email role",
        },
      });

    // Send email notification if appropriate conditions are met
    if (
      !isInternal &&
      ticketCreator &&
      ticketCreator.email &&
      ticketDoc.createdBy.toString() !== req.user._id.toString()
    ) {
      // Format date for email
      const formattedDate = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const ticketUrl = `${process.env.FRONTEND_URL}/tickets/${ticketDoc._id}`;

      try {
        await sendEmail({
          email: ticketCreator.email,
          subject: "New Comment on Your Support Ticket",
          template: "comment-added",
          date: {
            user: {
              firstName: ticketCreator.firstName,
              lastName: ticketCreator.lastName,
              email: ticketCreator.email,
            },
            ticket: {
              id: ticketDoc._id,
              title: ticketDoc.title,
              status: ticketDoc.status,
            },
            comment: {
              text: text,
              author: `${req.user.firstName} ${req.user.lastName}`,
              createdAt: formattedDate,
            },
            ticketUrl,
          },
        });

        console.log(
          `Comment notification email sent to ${ticketCreator.email}`
        );
      } catch (error) {
        // Log error but don't fail the request
        console.error("Error sending comment notification email:", error);
      }
    }

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: updatedTicket,
    });
  }
);

export const getTicketStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user && !["admin", "manager"].includes(req.user.role)) {
      return next(
        new HttpError("Not authorized to access ticket statistics", 403)
      );
    }

    const totalTickets = await Ticket.countDocuments();
    const statusStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          priority: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get tickets created in the last 7 days
    const lastWeekTickets = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Ticket statistics retrieved successfully",
      data: {
        totalTickets,
        statusStats,
        priorityStats,
        categoryStats,
        lastWeekTickets,
      },
    });
  }
);

export const getActiveUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user && !["admin", "manager"].includes(req.user.role)) {
      return next(
        new HttpError("Not authorized to access this information", 403)
      );
    }

    const activeUsers = await Ticket.aggregate([
      {
        $group: {
          _id: "$createdBy",
          ticketCount: { $sum: 1 },
          openTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", TicketStatus.OPEN] }, 1, 0],
            },
          },
          inProgressTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", TicketStatus.IN_PROGRESS] }, 1, 0],
            },
          },
          closedTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", TicketStatus.CLOSED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { ticketCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstName: { $arrayElemAt: ["$userInfo.firstName", 0] },
          lastName: { $arrayElemAt: ["$userInfo.lastName", 0] },
          email: { $arrayElemAt: ["$userInfo.email", 0] },
          ticketCount: 1,
          openTickets: 1,
          inProgressTickets: 1,
          closedTickets: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Active users retrieved successfully",
      data: activeUsers,
    });
  }
);
