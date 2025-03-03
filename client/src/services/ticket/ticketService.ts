import { AppError } from "../../utils/errors";
import { ApiClient } from "../api/apiClients";
import { END_POINTS } from "../api/endPoints";
import { ErrorType } from "../api/types";
import {
  ActiveUsersResponse,
  AddCommentData,
  CreateTicketData,
  TicketQueryParams,
  TicketResponse,
  TicketsResponse,
  TicketStatsResponse,
  UpdateTicketData,
} from "./type";

class TicketService {
  static async getTickets(
    params?: TicketQueryParams
  ): Promise<TicketsResponse> {
    try {
      return ApiClient.request<TicketsResponse>({
        url: END_POINTS.GET_ALL_TICKETS,
        method: "GET",
        //   params
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) {
        throw new AppError(
          "Authentication required to access tickets",
          ErrorType.AUTHENTICATION,
          401
        );
      }
      throw err;
    }
  }

  // Get ticket statistics
  static async getTicketStats(): Promise<TicketStatsResponse> {
    try {
      return ApiClient.request<TicketStatsResponse>({
        url: END_POINTS.TICKET_STATS,
        method: "GET",
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) {
        throw new AppError(
          "Authentication required to access ticket statistics",
          ErrorType.AUTHENTICATION,
          401
        );
      }
      throw err;
    }
  }

  // Get active users
  static async getActiveUsers(): Promise<ActiveUsersResponse> {
    try {
      return ApiClient.request<ActiveUsersResponse>({
        url: END_POINTS.ACTIVE_USERS,
        method: "GET",
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) {
        throw new AppError(
          "Authentication required to access active users",
          ErrorType.AUTHENTICATION,
          401
        );
      }
      throw err;
    }
  }

  // Get ticket by ID
  static async getTicketById(id: string): Promise<TicketResponse> {
    try {
      return ApiClient.request<TicketResponse>({
        url: END_POINTS.GET_TICKETS_BYID(id),
        method: "GET",
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 404) {
        throw new AppError("Ticket not found", ErrorType.NOT_FOUND, 404, {
          ticketId: id,
        });
      }
      throw err;
    }
  }

  // Create new ticket
  static async createTicket(data: CreateTicketData): Promise<TicketResponse> {
    try {
      return ApiClient.request<TicketResponse>({
        url: END_POINTS.GET_ALL_TICKETS,
        method: "POST",
        data,
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 400) {
        throw new AppError("Invalid ticket data", ErrorType.VALIDATION, 400);
      }
      throw err;
    }
  }

  // Update ticket
  static async updateTicket(
    id: string,
    data: UpdateTicketData
  ): Promise<TicketResponse> {
    try {
      return ApiClient.request<TicketResponse>({
        url: END_POINTS.UPDATE_TICKETS(id),
        method: "PATCH",
        data,
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 404) {
        throw new AppError("Ticket not found", ErrorType.NOT_FOUND, 404, {
          ticketId: id,
        });
      }
      throw err;
    }
  }

  // Delete ticket
  static async deleteTicket(id: string): Promise<void> {
    try {
      return ApiClient.request<void>({
        url: END_POINTS.DELETE_TICKET(id),
        method: "DELETE",
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 404) {
        throw new AppError("Ticket not found", ErrorType.NOT_FOUND, 404, {
          ticketId: id,
        });
      }
      throw err;
    }
  }

  // Add comment to ticket
  static async addComment(
    ticketId: string,
    data: AddCommentData
  ): Promise<TicketResponse> {
    try {
      return ApiClient.request<TicketResponse>({
        url: END_POINTS.ADD_COMMENT(ticketId),
        method: "POST",
        data,
      });
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 404) {
        throw new AppError("Ticket not found", ErrorType.NOT_FOUND, 404, {
          ticketId,
        });
      } else if (err instanceof AppError && err.statusCode === 400) {
        throw new AppError("Invalid comment data", ErrorType.VALIDATION, 400);
      }
      throw err;
    }
  }
}

export default TicketService;
