import { userRoles } from "../../middleWare/auth.middleware.js";

export const endpoint = {
  profile: [userRoles.user ,userRoles.admin],
  updateProfile: [userRoles.user, userRoles.admin],
  deleteAccount: [userRoles.user ,userRoles.admin],
  adminDashboard: [userRoles.admin],// ⬅️ Add this if you have admin-only routes
  userDashboard:[userRoles.user]
};
