export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
}
export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  status: number;
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export interface APIResponse<T> {
  status: string;
  data: T;
  message?: string;
  error?: string | null;
}
export type HTTPMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
export interface Role {
  name: string;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: NavItem[];
  badge?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
export enum ErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
  NOT_FOUND = "NOTFOUND",
}
