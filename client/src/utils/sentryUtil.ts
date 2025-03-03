import * as Sentry from "@sentry/react";
import { useAuthStore } from "../store/authStore";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

function trackError(
  error: unknown,
  operation: { type: "query" | "mutation"; key: string[] | undefined },
  user: User | null,
  variables?: unknown
) {
  Sentry.withScope((scope) => {
    scope.setTags({
      operationType: operation.type,
      operationKey: operation.key?.join(".") || "anonymous",
      errorType: (error as Error).name,
      userId: user?.id,
    });

    scope.setExtras({
      operationKey: operation.key,
      user: { id: user?.id, firstName: user?.firstName },
      variables,
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(error);
  });
}

// Custom error
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

//  query tracking
export function useTrackedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options = {}
) {
  const user = useAuthStore((state) => state.user);

  Sentry.addBreadcrumb({
    category: "query",
    message: `Executing ${queryKey.join(".")}`,
    level: "info",
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn();
        return result;
      } catch (error) {
        handleQueryError(error, queryKey, user);
        throw error;
      }
    },
    ...options,
  });
}

//mutation tracking
export function useTrackedMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn"> = {}
) {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      Sentry.addBreadcrumb({
        category: "mutation",
        message: `Executing ${options.mutationKey?.join(".") || "anonymous"}`,
        level: "info",
      });

      try {
        const result = await mutationFn(variables);
        return result;
      } catch (error) {
        handleMutationError(
          error,
          options.mutationKey as string[],
          user,
          variables
        );
        throw error;
      }
    },
    ...options,
  });
}

// Error handlers
function handleQueryError(
  error: unknown,
  queryKey: string[],
  user: User | null
) {
  trackError(error, { type: "query", key: queryKey }, user);
}

function handleMutationError(
  error: unknown,
  mutationKey: string[] | undefined,
  user: User | null,
  variables: unknown
) {
  trackError(error, { type: "mutation", key: mutationKey }, user, variables);
}

//  auth hooks with error handling
type MutationOptions = {
  onError?: (error: Error) => void;
  [key: string]: unknown;
};

export const useAuthenticatedMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions = {}
) => {
  const { setIsAuthenticated, clearUser } = useAuthStore();

  return useTrackedMutation(mutationFn, {
    ...options,
    onError: (error: Error) => {
      if (error instanceof AuthenticationError) {
        setIsAuthenticated(false);
        clearUser();
        window.location.href = "/signin";
      }
      options.onError?.(error);
    },
  });
};
