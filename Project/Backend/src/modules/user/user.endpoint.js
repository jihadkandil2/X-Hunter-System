import { userRoles } from "../../middleWare/auth.middleware.js";

export const endpoint={
    profile:[userRoles.user]
}