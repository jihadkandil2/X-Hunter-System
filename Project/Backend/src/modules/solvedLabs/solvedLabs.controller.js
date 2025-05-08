import { Router } from "express";
import { authentication } from "../../middleWare/auth.middleware.js";
import { authorization } from "../../middleWare/auth.middleware.js";
import { endpoint } from "../user/user.endpoint.js";
import addSolvedLab from "./services/addSolvedLab.service.js";
import getAllSolvedLabs from "./services/getAllSolvedLabs.service.js";
const router = Router();

router.post('/add/:labId' , authentication() , addSolvedLab)
router.get('/all' , authentication() , authorization(endpoint.adminDashboard) , getAllSolvedLabs)



export default router;