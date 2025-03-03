import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth/authServices";
import { useTrackedMutation } from "../utils/sentryUtil";
import showToast from "../utils/toastHelper";
import useAuth from "../store/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { AppError } from "../utils/errors";
import { ErrorType } from "../services/api/types";

export const useSignup = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useAuth();
  const { mutateAsync, isError, isPending, isSuccess } = useTrackedMutation(
    AuthService.signup,
    {
      mutationKey: ["signup"],
      onSuccess: (data) => {
        if (data.status === "success") {
          setIsLoading(true);
          localStorage.setItem("email", data.email);
          showToast(data.message, "success");
          navigate("/verify");
          setIsLoading(false);
        }
      },
    }
  );
  return {
    signup: mutateAsync,
    signupError: isError,
    signupLoading: isPending,
    signupSuccess: isSuccess,
  };
};
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated, setIsLoading } = useAuth();
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    AuthService.login,
    {
      mutationKey: ["login"],
      onSuccess: (data) => {
        console.log("data", data);
        setIsLoading(true);
        if (data.accessToken) {
          console.log("data", data);
          setIsAuthenticated(true);
          localStorage.setItem("token", data.accessToken);
          setUser(data.user);
          queryClient.invalidateQueries({ queryKey: ["user"] });
          showToast("Login sucessfully", "success");
        }
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.AUTHENTICATION:
              showToast("Invalid email or password", "error");
              break;
            case ErrorType.NETWORK:
              showToast("Network Error", "error");
              break;
            default:
              showToast("Something went wrong", "error");
              break;
          }
        }
      },
    }
  );
  return {
    login: mutateAsync,
    loginLoading: isPending,
    loginError: isError,
    loginSuccess: isSuccess,
  };
};
export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useAuth();
  const { mutateAsync, isError, isPending } = useTrackedMutation(
    AuthService.verifyOtp,
    {
      mutationKey: ["verify-otp"],
      onSuccess: (data) => {
        if (data.status === "success") {
          setIsLoading(true);
          navigate("/login", { replace: true });
          setIsLoading(false);
        }
      },
    }
  );
  return {
    verifyOtp: mutateAsync,
    loadingVerify: isPending,
    verifyError: isError,
  };
};
export const useRequestNewOtp = () => {
  const navigate = useNavigate();
  const { mutateAsync, isError, isPending } = useTrackedMutation(
    AuthService.requestNewOtp,
    {
      mutationKey: ["new-otp"],
      onSuccess: (data) => {
        if (data.status === "success") {
          navigate("/login", { replace: true });
        }
      },
    }
  );
  return {
    requestNewOtp: mutateAsync,
    loadingRequestNewOtp: isPending,
    requestNewOptError: isError,
  };
};
