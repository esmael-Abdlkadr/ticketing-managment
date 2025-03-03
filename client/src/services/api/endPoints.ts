export const END_POINTS = {
  //auth
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
  REQUEST_NEW_OTP: "/auth/request-new-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  // users
  CURRENT_USER: "/users/me",
  UPDATE_CURRENT_USER: "/users/update-me",
  DELETE_CURRENT_USER: "/users/delete-me",
  ALL_USERS: "/users/all",
  ASSIGN_ROLE: "/users/:userId/assign-role",
  INVITE_USER: "/users/invite-user",
  COMPLETE_REGISTRATION: "/users/complete-registration",
  ORGANIZER_USERS: "/users",
  // tickets.
  GET_ALL_TICKETS: "/tickets",
  TICKET_STATS: "/tickets/stats",
  ACTIVE_USERS: "tickets/active-users",
  GET_TICKETS_BYID: (id: string) => `tickets/${id}`,
  UPDATE_TICKETS: (id: string) => `tickets/${id}`,
  DELETE_TICKET: (id: string) => `tickets/${id}`,
  ADD_COMMENT: (id: string) => `tickets/${id}/comments`,
};
