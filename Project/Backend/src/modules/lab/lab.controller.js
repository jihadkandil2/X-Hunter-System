import { Router } from "express";
import addLab from './services/addLab.service.js';
import getLabs from "./services/getLabs.service.js";
import updateLab from "./services/updateLab.js";
import deleteLab from "./services/deleteLab.service.js";
import fetsh from "./services/test.service.js";
import getByVulnName from "./services/searchByVulnName.js";
import getLabById from "./services/getLabById.service.js";
const router=Router();

router.post('/add' , addLab)
router.get('/all',getLabs)
router.put('/:id' , updateLab)
router.delete('/:id',deleteLab)
router.get('/fetsh' , fetsh);
router.get('/getByVulnName' , getByVulnName)
router.get('/getById/:id' , getLabById)
export default router;