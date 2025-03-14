import { Router } from "express";
import { profile } from "./services/userProfile.service.js";
import { authentication, authorization, userRoles } from "../../middleWare/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
const router=Router();

router.get('/profile', authentication() , authorization(endpoint.profile) , profile)
export default router;