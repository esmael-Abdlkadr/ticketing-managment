import { Document, Schema, Types } from "mongoose";

export enum UserRole {
  CUSTOMER = "customer",
  SUPPORT_AGENT = "support_agent",
  MANAGER = "manager",
  ADMIN = "admin",
  VENDOR = "vendor",
}

export enum TicketStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  CLOSED = "Closed",
}

export enum TicketPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TicketCategory {
  TECHNICAL = "Technical",
  BILLING = "Billing",
  GENERAL = "General",
  FEATURE_REQUEST = "Feature Request",
}

export enum Permissions {
  // Permissions for Customers
  CREATE_TICKET = "ticket:create",
  VIEW_OWN_TICKET = "ticket:view:own",
  UPDATE_OWN_TICKET = "ticket:update:own",

  // Permissions for Support Agents
  VIEW_ASSIGNED_TICKET = "ticket:view:assigned",
  UPDATE_TICKET_STATUS = "ticket:update:status",
  ADD_INTERNAL_NOTE = "ticket:add:internal_note",

  // Permissions for Managers/Team Leads
  VIEW_TEAM_TICKETS = "ticket:view:team",
  REASSIGN_TICKET = "ticket:reassign", // Reassign tickets to other agents

  // Permissions for Administrators
  VIEW_ALL_TICKETS = "ticket:view:all",
  MANAGE_USERS = "user:manage", // Create, update, or deactivate user accounts
  SYSTEM_SETTINGS = "system:settings",
  VIEW_AUDIT_LOGS = "audit:view",

  // Permissions for Vendor
  VIEW_VENDOR_TICKET = "ticket:view:vendor",
  UPDATE_VENDOR_TICKET = "ticket:update:vendor",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  password: string;
  otp?: string;
  otpExpires?: Date;
  role: UserRole;
  inviteToken?: string;

  inviteExpires?: Date;
  assignedDepartment?: string;
  createdTickets: Types.ObjectId[];
  permissions: string[];
  isActive: boolean;
  passwordResetExpires: Date;
  passwordResetToken: String;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  isResetTokenValid: () => boolean;
  isOtpValid: () => boolean;
}

export interface IComment {
  _id?: Types.ObjectId;
  text: string;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
  comments: IComment[];
}
