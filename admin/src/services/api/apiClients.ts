import { AxiosError } from "axios";
import instance from "./axiosConfig";
import { handleError } from "./ErrorHandler";
import { ApiSuccessResponse } from "./types";
import { ApiError } from "./apiError";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientOptions<T> {
  url: string;
  method?: HttpMethod;
  data?: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export class ApiClient {
  private static isApiResponse<T>(
    response: unknown
  ): response is ApiSuccessResponse<T> {
    const res = response as ApiSuccessResponse<T>;
    return (
      res &&
      typeof res === "object" &&
      "status" in res &&
      res.status === "success" &&
      "data" in res
    );
  }

  static async request<TResponse>({
    url,
    method = "GET",
    data,
    params,
    headers,
  }: ApiClientOptions<any>): Promise<TResponse> {
    try {
      const response = await instance({
        url,
        method,
        data: method !== "GET" ? data : undefined,
        params: method === "GET" ? params : undefined,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      // Check if response has our API structure
      if (this.isApiResponse<TResponse>(response.data)) {
        return response.data.data as TResponse;
      }

      return response.data as TResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status || 500;

        // Handle 401 Unauthorized error - redirect to login
        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("auth-store");
          window.location.href = "/login";
          throw new ApiError("Session expired. Please login again.", 401);
        }

        const message = handleError(error);
        throw new ApiError(message, status);
      }
      throw new ApiError("Unknown error occurred", 500);
    }
  }
}
