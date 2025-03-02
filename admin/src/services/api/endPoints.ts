export const END_POINTS = {
  //auth
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
  REQUEST_NEW_OTP: "/auth/request-new-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  // users
  MY_INFO: "/users/me",
  UPDATE_ME: "/users/update-me",
  DELETE_ME: "/users/delete-me",
  USERS: "/users",
  CREATE_EVENT_USER: "/users/create-event-user",
  ASSIGN_ROLE: (id: string) => `/users/${id}/assign-role`,
  // tickets.
  GET_ALL_TICKETS: "/tickets",
  TICKET_STATS: "/tickets/stats",
  ACTIVE_USERS: "tickets/active-users",
  GET_TICKETS_BYID: (id: string) => `tickets/${id}`,
  UPDATE_TICKETS: (id: string) => `tickets/${id}`,
  DELETE_TICKET: (id: string) => `tickets/${id}`,
  ADD_COMMENT: (id: string) => `tickets/${id}/comments`,
};
