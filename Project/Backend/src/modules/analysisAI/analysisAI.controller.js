import { Router } from "express";
import * as analysisServices from './services/getAIResponse.js';
import mariamModel from "./services/mariam.model.js";
const router=Router();

router.post('/analyze' , analysisServices.analyze)
router.post('/generate-lab' , mariamModel)
export default router;