import { ErrorType } from "../api/types";
import { AppError } from "../../utils/errors"; 
import { ApiClient } from "../api/apiClients"; 
import { END_POINTS } from "../api/endPoints"; 
import { AuthResponse, RequestNewOtpResponse, VerifyOtpResponse } from "./type";
import { LoginData, SignupData, SignupResponse, VerifyOtp } from "./type";
class AuthService {
  static async signup(data: SignupData): Promise<SignupResponse> {
    return ApiClient.request({
      url: END_POINTS.SIGNUP,
      method: "POST",
      data,
    });
  }
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      return ApiClient.request<AuthResponse>({
        url: END_POINTS.LOGIN,
        method: "POST",
        data,
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) {
        throw new AppError(
          "Invalid email or password",
          ErrorType.AUTHENTICATION,
          401,
          { email: data.email }
        );
      }
      throw err;
    }
  }
  static async verifyOtp(data: VerifyOtp): Promise<VerifyOtpResponse> {
    return ApiClient.request({
      url: END_POINTS.VERIFY_OTP,
      method: "POST",
      data,
    });
  }
  static async requestNewOtp(email: string): Promise<RequestNewOtpResponse> {
    return ApiClient.request({
      url: END_POINTS.REQUEST_NEW_OTP,
      method: "POST",
      data: { email },
    });
  }

  static async forgotPassword(email: string): Promise<void> {
    return ApiClient.request({
      url: END_POINTS.FORGOT_PASSWORD,
      method: "POST",
      data: { email },
    });
  }
}
export default AuthService;
