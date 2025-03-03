
export enum UserRole {
    SUPPORT_AGENT = "support_agent",
    MANAGER = "manager",
    ADMIN = "admin",
    VENDOR = "vendor",
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified?: boolean;
  createdTickets?: string[];
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string | null;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  role?: string;
  status?: string;
}

export interface CreateUserInviteDto {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface CompleteRegistrationDto {
  token: string;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AssignRoleDto {
  roleName: UserRole;
}

export interface UserResponse {
  status: string;
  message?: string;
  data: User | User[];
  results?: number;
}

export interface UserInviteResponse {
    status: string;
    message: string;
    data: {
      userId: string;
      email: string;
      expiresAt: string;
    };
}
export interface CompleteRegistrationDto {
    token: string;
    password: string;
  }
  
  export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
  }
  export interface CompleteRegistrationResponse {
    user: User;
    accessToken: string;
  }