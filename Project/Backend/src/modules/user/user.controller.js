import { Router } from "express";
import { profile } from "./services/userProfile.service.js";
const router=Router();
router.get('/profile', profile)
export default router;