import { Router } from "express";
import * as analysisServices from './services/getAIResponse.js';

const router=Router();

router.post('/analyze' , analysisServices.analyze)
export default router;