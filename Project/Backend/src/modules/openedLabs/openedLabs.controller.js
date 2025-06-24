import { Router } from "express";
import addOpenedLab from "./services/addOpenedLabs.service.js";
import { authentication } from "../../middleWare/auth.middleware.js";
import getOpenedLabs from "./services/getOpenedLabByUserId.js";
import deleteOpenedLab from "./services/deleteFromOpenedLabs.service.js";
const router = Router();

router.post('/add/:labId' , authentication() , addOpenedLab)
router.get('/getByUserId' , authentication() , getOpenedLabs)
router.delete('/delete/:labId' , authentication() , deleteOpenedLab)


export default  router;