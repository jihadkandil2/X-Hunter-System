import { Router } from "express";
import addLab from './services/addLab.service.js';
import getLabs from "./services/getLabs.service.js";
import updateLab from "./services/updateLab.js";
import deleteLab from "./services/deleteLab.service.js";
import fetsh from "./services/test.service.js";
import getByVulnName from "./services/searchByVulnName.js";
import getLabById from "./services/getLabById.service.js";
import generateLabFiles from "./services/generateLabFile.service.js";
import { spawn } from "child_process";
const router=Router();

router.post('/add' , addLab)
router.get('/all',getLabs)
router.put('/:id' , updateLab)
router.delete('/:id',deleteLab)
router.get('/fetsh' , fetsh);
router.get('/getByVulnName' , getByVulnName)
router.get('/getById/:id' , getLabById)


router.get('/run/:id', async (req, res) => {
  try {
    const labId = req.params.id;
    const port = 4000 + Math.floor(Math.random() * 1000); // ✅ Generate random port

    const { filePath } = await generateLabFiles(labId, port); // ✅ Pass port to generator

    const child = spawn('node', [filePath], {
      env: { ...process.env, PORT: port.toString() },
      stdio: 'inherit' // optional: log output directly
    });

    // ✅ Immediately return to frontend
    // return res.status(200).json({
    //   message: `Lab ${labId} started.`,
    //   url: `http://localhost:${port}/`, // ✅ Final Lab URL
    //   port,
    //   note: 'Lab is running in background. Open the URL to start the lab.'
    // });
      return res.status(200).json({
      status:'success',
      url: `http://localhost:${port}/`, // ✅ Final Lab URL
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Failed to start lab.',
      error: error.message
    });
  }
});



// -------------------------------------------------



// router.get('/run/:id', async (req, res) => {
//   try {
//     const labId = req.params.id;
//      const port = 4000 + Math.floor(Math.random() * 1000); // ✅ Generate random port
//     const { filePath } = await generateLabFiles(labId , port);

//     const child = spawn('node', [filePath]);

//     let errorOutput = '';
//     let successMessage = '';

//     child.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//       successMessage += data.toString();
//     });

//     child.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//       errorOutput += data.toString();
//     });

//     child.on('close', (code) => {
//       if (code === 0) {
//         console.log(`Lab ${labId} finished successfully.`);
//       } else {
//         console.log(`Lab ${labId} exited with error.`);
//       }
//     });

//     // Respond immediately (async run)
//     return res.status(200).json({
//       message: `Lab ${labId} started.`,
//       note: 'Lab is running in background.',
//       warning: 'If lab has runtime errors, check server logs.',
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: 'Failed to start lab.',
//       error: error.message
//     });
//   }
// });


export default router;