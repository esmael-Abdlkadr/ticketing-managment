import TicketService from "../services/ticket/ticketService";
import { useTrackedMutation, useTrackedQuery } from "../utils/sentryUtil";
import showToast from "../utils/toastHelper";
import { useQueryClient } from "@tanstack/react-query";
import { AppError } from "../utils/errors";
import { ErrorType } from "../services/api/types";
import { TicketQueryParams } from "../services/ticket/type";

export const useGetTickets = (params?: TicketQueryParams) => {
  return useTrackedQuery(["tickets", params], () =>
    TicketService.getTickets(params)
  );
};

export const useGetTicketById = (id: string) => {
  return useTrackedQuery(
    ["ticket", id],
    () => TicketService.getTicketById(id),
    {
      enabled: !!id, // Only fetch if ID is provided
    }
  );
};

export const useGetTicketStats = () => {
  return useTrackedQuery(["ticket-stats"], () =>
    TicketService.getTicketStats()
  );
};

export const useGetActiveUsers = () => {
  return useTrackedQuery(["active-users"], () =>
    TicketService.getActiveUsers()
  );
};

// The rest of your hook implementations remain the same
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    (data) => TicketService.createTicket(data),
    {
      mutationKey: ["create-ticket"],
      onSuccess: (data) => {
        showToast("Ticket created successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.VALIDATION:
              showToast("Invalid ticket data", "error");
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
    createTicket: mutateAsync,
    createTicketLoading: isPending,
    createTicketError: isError,
    createTicketSuccess: isSuccess,
  };
};

export const useUpdateTicket = (id: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    (data) => TicketService.updateTicket(id, data),
    {
      mutationKey: ["update-ticket", id],
      onSuccess: (data) => {
        showToast("Ticket updated successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["ticket", id] });
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.NOT_FOUND:
              showToast("Ticket not found", "error");
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
    updateTicket: mutateAsync,
    updateTicketLoading: isPending,
    updateTicketError: isError,
    updateTicketSuccess: isSuccess,
  };
};

export const useDeleteTicket = (id: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    () => TicketService.deleteTicket(id),
    {
      mutationKey: ["delete-ticket", id],
      onSuccess: () => {
        showToast("Ticket deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.NOT_FOUND:
              showToast("Ticket not found", "error");
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
    deleteTicket: mutateAsync,
    deleteTicketLoading: isPending,
    deleteTicketError: isError,
    deleteTicketSuccess: isSuccess,
  };
};

export const useAddComment = (ticketId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, isSuccess } = useTrackedMutation(
    (data) => TicketService.addComment(ticketId, data),
    {
      mutationKey: ["add-comment", ticketId],
      onSuccess: (data) => {
        showToast("Comment added successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      },
      onError: (error) => {
        if (error instanceof AppError) {
          switch (error.type) {
            case ErrorType.NOT_FOUND:
              showToast("Ticket not found", "error");
              break;
            case ErrorType.VALIDATION:
              showToast("Invalid comment data", "error");
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
    addComment: mutateAsync,
    addCommentLoading: isPending,
    addCommentError: isError,
    addCommentSuccess: isSuccess,
  };
};
