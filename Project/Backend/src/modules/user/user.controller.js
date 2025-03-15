import { Router } from "express";
import { profile } from "./services/userProfile.service.js";
import { authentication, authorization, userRoles } from "../../middleWare/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
import updateProfile from "./services/updateProfile.service.js";
import deleteAccount from "./services/deleteAccount.service.js";
const router=Router();

router.get('/profile', authentication() , authorization(endpoint.profile) , profile);
router.put('/profile/update/:id' , authentication() , authorization(endpoint.updateProfile),updateProfile)
router.delete('/profile/delete/:id', authentication() , authorization(endpoint.deleteAccount),deleteAccount)
export default router;