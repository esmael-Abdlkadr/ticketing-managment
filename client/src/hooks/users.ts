import { useNavigate } from "react-router-dom";
import UserService from "../services/users/userService";
import { useTrackedMutation, useTrackedQuery } from "../utils/sentryUtil";
import showToast from "../utils/toastHelper";
import useAuth from "../store/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { AppError } from "../utils/errors";
import { ErrorType } from "../services/api/types";
import { 
  UserQueryParams, 
  UpdateUserDto, 
  AssignRoleDto, 
  CreateUserInviteDto, 
  CompleteRegistrationDto,
  User,
  UserResponse 
} from "../services/users/types";

// Hook for fetching current user
export const useGetCurrentUser = () => {
  return useTrackedQuery(
    ["currentUser"], 
    () => UserService.getCurrentUser(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  );
};

// Hook for fetching all users with pagination and filters
export const useGetAllUsers = (queryParams?: UserQueryParams) => {
  return useTrackedQuery(
    ["users", queryParams], 
    () => UserService.getAllUsers(queryParams),
    {
      keepPreviousData: true,
      staleTime: 30 * 1000 // 30 seconds
    }
  );
};

// Hook for fetching organizer users
export const useGetOrganizerUsers = (queryParams?: UserQueryParams) => {
  return useTrackedQuery(
    ["organizerUsers", queryParams], 
    () => UserService.getOrganizerUsers(queryParams),
    {
      keepPreviousData: true
    }
  );
};

// Hook for updating current user
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    UserService.updateCurrentUser,
    {
      mutationKey: ["update-user"],
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        showToast("Profile updated successfully", "success");
      },
      onError: (error) => {
        if (error instanceof AppError) {
          showToast(error.message || "Failed to update profile", "error");
        }
      }
    }
  );
  
  return {
    updateUser: mutateAsync,
    updateLoading: isPending,
    updateError: isError,
    updateSuccess: isSuccess,
  };
};

// Hook for deleting current user
export const useDeleteCurrentUser = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  
  const { mutateAsync, isPending, isError } = useTrackedMutation(
    UserService.deleteCurrentUser,
    {
      mutationKey: ["delete-user"],
      onSuccess: () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("auth-store");
        showToast("Your account has been deleted", "success");
        navigate("/login");
      },
      onError: (error) => {
        if (error instanceof AppError) {
          showToast(error.message || "Failed to delete account", "error");
        }
      }
    }
  );
  
  return {
    deleteUser: mutateAsync,
    deleteLoading: isPending,
    deleteError: isError,
  };
};

// Hook for assigning a role to user
export const useAssignRole = (userId: string) => {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending, isError } = useTrackedMutation(
    (data: AssignRoleDto) => UserService.assignRoleToUser(userId, data),
    {
      mutationKey: ["assign-role", userId],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        showToast("Role assigned successfully", "success");
      },
      onError: (error) => {
        if (error instanceof AppError) {
          showToast(error.message || "Failed to assign role", "error");
        }
      }
    }
  );
  
  return {
    assignRole: mutateAsync,
    assignRoleLoading: isPending,
    assignRoleError: isError,
  };
};

// Hook for inviting a new user
export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending, isError } = useTrackedMutation(
    UserService.inviteUser,
    {
      mutationKey: ["invite-user"],
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        showToast("User invited successfully", "success");
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.VALIDATION:
              showToast("User with this email already exists", "error");
              break;
            default:
              showToast(error.message || "Failed to invite user", "error");
          }
        }
      }
    }
  );
  
  return {
    inviteUser: mutateAsync,
    inviteLoading: isPending,
    inviteError: isError,
  };
};


export const useCompleteRegistration = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  
  const { mutateAsync, isPending, isError } = useTrackedMutation(
    UserService.completeRegistration,
    {
      mutationKey: ["complete-registration"],
      onSuccess: (data) => {
        if (data.accessToken) {
          setIsAuthenticated(true);
          localStorage.setItem("token", data.accessToken);
          setUser(data.user);
          showToast("Registration completed successfully", "success");
          navigate("/");
        }
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.VALIDATION:
              showToast("Invalid or expired invitation token", "error");
              break;
            default:
              showToast(error.message || "Failed to complete registration", "error");
          }
        }
      }
    }
  );
  
  return {
    completeRegistration: mutateAsync,
    registrationLoading: isPending,
    registrationError: isError,
  };
};