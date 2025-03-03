import { ErrorType } from "../api/types";
import { AppError } from "../../utils/errors"; 
import { ApiClient } from "../api/apiClients"; 
import { END_POINTS } from "../api/endPoints"; 
import { 
  User, 
  UserQueryParams,
  CreateUserInviteDto, 
  CompleteRegistrationDto,
  UpdateUserDto,
  AssignRoleDto,
  UserResponse,
  UserInviteResponse,
  CompleteRegistrationResponse
} from "./types";

class UserService {
  // Get current user information
  static async getCurrentUser(): Promise<User> {
    return ApiClient.request<User>({
      url: END_POINTS.CURRENT_USER,
      method: "GET",
    });
  }

  // Update current user profile
  static async updateCurrentUser(data: UpdateUserDto): Promise<User> {
    return ApiClient.request<User>({
      url: END_POINTS.UPDATE_CURRENT_USER,
      method: "PATCH",
      data,
    });
  }

  // Delete current user (deactivate)
  static async deleteCurrentUser(): Promise<void> {
    return ApiClient.request<void>({
      url: END_POINTS.DELETE_CURRENT_USER,
      method: "DELETE",
    });
  }

  // Get all users (admin only)
  static async getAllUsers(params?: UserQueryParams): Promise<UserResponse> {
    return ApiClient.request<UserResponse>({
      url: END_POINTS.ALL_USERS,
      method: "GET",
      params,
    });
  }

  // Assign role to a user
  static async assignRoleToUser(userId: string, data: AssignRoleDto): Promise<User> {
    const url = END_POINTS.ASSIGN_ROLE.replace(':userId', userId);
    return ApiClient.request<User>({
      url,
      method: "PATCH",
      data,
    });
  }

  // Invite a new user
  static async inviteUser(data: CreateUserInviteDto): Promise<UserInviteResponse> {
    try {
      return ApiClient.request<UserInviteResponse>({
        url: END_POINTS.INVITE_USER,
        method: "POST",
        data,
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 400) {
        throw new AppError(
          "User with this email already exists",
          ErrorType.VALIDATION,
          400
        );
      }
      throw err;
    }
  }

  // Complete registration from invitation
  static async completeRegistration(data: CompleteRegistrationDto): Promise<CompleteRegistrationResponse> {
    try {
      return ApiClient.request<CompleteRegistrationResponse>({
        url: END_POINTS.COMPLETE_REGISTRATION,
        method: "POST",
        data,
      });
      
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 400) {
        throw new AppError(
          "Invalid or expired invitation token",
          ErrorType.VALIDATION,
          400
        );
      }
      throw err;
    }
  }

  // Get organizer users
  static async getOrganizerUsers(params?: UserQueryParams): Promise<UserResponse> {
    return ApiClient.request<UserResponse>({
      url: END_POINTS.ORGANIZER_USERS,
      method: "GET",
      params,
    });
  }
}

export default UserService;