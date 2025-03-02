export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  text: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ticketId: string;
  createdAt: string;
  updatedAt: string;
  isInternal?: boolean;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface ActiveUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketsCreated: number;
  lastActivity: string;
}

// Request payload types
export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
}

export interface AddCommentData {
  text: string;
  isInternal?: boolean;
}

// Response types
export interface TicketsResponse {
  status: string;
  results: number;
  data: Ticket[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface TicketResponse {
  status: string;
  data: Ticket;
}

export interface TicketStatsResponse {
  status: string;
  data: TicketStats;
}

export interface ActiveUsersResponse {
  status: string;
  data: ActiveUser[];
}

// Query parameters interface
export interface TicketQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  sortBy?: string;
  search?: string;
}
