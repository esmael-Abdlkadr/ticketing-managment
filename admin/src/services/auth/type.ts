export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
export interface SignupResponse {
  status: string;
  message: string;
  email: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOtp {
  email: string;
  otp: string;
}
export interface RequestNewOtp {
  email: string;
}
export interface RequestNewOtpResponse {
  status: string;
  message: string;
  email: string;
}
export interface ForgotPassword {
  email: string;
}
export interface ApiSuccessResponse<T> {
  status: string;
  message?: string;
  data: T;
  results?: number;
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  isActive: boolean;
  eventCreated?: string[];
  role: string;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
export interface VerifyOtpResponse {
  status: string;
  message: string;
  data: User;
}
