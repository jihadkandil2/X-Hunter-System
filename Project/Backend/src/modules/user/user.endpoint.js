import { userRoles } from "../../middleWare/auth.middleware.js";

export const endpoint={
    profile:[userRoles.user],
    updateProfile:[userRoles.user , userRoles.admin],
    deleteAccount:[userRoles.user]
}