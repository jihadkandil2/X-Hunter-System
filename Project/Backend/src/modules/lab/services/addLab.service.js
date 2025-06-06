import Lab from '../../../DB/model/Lab.model.js';
import Vulnerability from '../../../DB/model/vulnerability.model.js';

import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// function sanitizeProjectName(name) {
//     return name
//         .toLowerCase()
//         .trim()
//         .replace(/[^a-z0-9._-]/g, '-')  // replace non-allowed characters with `-`
//         .replace(/-{2,}/g, '-')         // collapse multiple dashes
//         .replace(/(\.\.\.|---)/g, '-') // remove forbidden sequences like '---'
//         .replace(/^-+|-+$/g, '')        // trim leading/trailing dashes
//         .slice(0, 100);                 // enforce Vercel's max length
// }



// async function deployToVercel(srcCode, labName) {
//      const sanitizedLabName = sanitizeProjectName(labName);
//      console.log(`Deploying project: ${sanitizedLabName}`);
     
//     const dir = path.join("/tmp/labs", nanoid());
//     await fs.mkdir(dir, { recursive: true });

//     await fs.writeFile(path.join(dir, "index.js"), srcCode);
//     // Create package.json with sanitized name
//     await fs.writeFile(path.join(dir, "package.json"), JSON.stringify({
//         name: sanitizedLabName,
//         main: "index.js",
//         scripts: { start: "node index.js" }
//     }, null, 2));

//       // Optional: add vercel.json to skip prompts
//     await fs.writeFile(path.join(dir, "vercel.json"), JSON.stringify({
//         version: 2,
//         builds: [{ src: "index.js", use: "@vercel/node" }],
//     }, null, 2));

//     const vercelCommand = `cd ${dir} && vercel --prod --yes --name=${sanitizedLabName}`;
//     return new Promise((resolve, reject) => {
//         exec(vercelCommand, (err, stdout, stderr) => {
//             if (err) return reject(stderr);
//             const match = stdout.match(/https?:\/\/[^\s]+\.vercel\.app/);
//             resolve(match?.[0] || null);
//         });
//     });
// }


// //////////////////////////////////////////////////
// function sanitizeProjectName(name) {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9._-]/g, '-')
//     .replace(/-{2,}/g, '-')
//     .replace(/(\.\.\.|---)/g, '-')
//     .replace(/^-+|-+$/g, '')
//     .slice(0, 100);
// }

// async function deployToRailway(srcCode, labName) {
//     console.log('im in top of the function');
    
//   const sanitizedLabName = sanitizeProjectName(labName);
//   console.log(`Deploying project: ${sanitizedLabName}`);
//   const projectDir = path.join("tmp", nanoid());
//   console.log(projectDir);
  

//   await fs.mkdir(projectDir, { recursive: true });

//   // Write source code
//   await fs.writeFile(path.join(projectDir, 'index.js'), srcCode);

//   // Write package.json
//   await fs.writeFile(
//     path.join(projectDir, 'package.json'),
//     JSON.stringify({
//       name: sanitizedLabName,
//       main: 'index.js',
//       scripts: {
//         start: 'node index.js'
//       }
//     }, null, 2)
//   );
//      // Shell commands: initialize Railway project and deploy
//     const initCmd = `cd ${projectDir} && railway init`;
//     const upCmd = `cd ${projectDir} && railway up`;

//    return new Promise((resolve, reject) => {
//         exec(`${initCmd} && ${upCmd}`, (err, stdout, stderr) => {
//             if (err) return reject(`Railway deploy error:\n${stderr}`);
//             const urlMatch = stdout.match(/(https?:\/\/[a-z0-9\-]+\.up\.railway\.app)/);
//             resolve(urlMatch?.[0] || null);
//         });
//     });
// }


const addLab=async(req,res,next)=>{
    try {
         const {labs} = req.body;
        //   for (const lab of labs) {
        //     lab.liveUrl = await deployToRailway(lab.srcCode, lab.vulnerabilityName);
        // }
        const vulnerability = await Vulnerability.findOneAndUpdate(
            { name:labs[0].vulnerabilityName }, 
            {}, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        const insertedLabs = await Lab.insertMany(labs);
        console.log("Inserted Labs:", insertedLabs);
        await Vulnerability.findByIdAndUpdate(vulnerability._id, { $push: { labs: { $each: insertedLabs.map(lab => lab._id) } } });
       
        console.log(`Deployed and added ${insertedLabs.length} labs to ${vulnerability.name}`);
        return res.json({vulnerabilityName:labs[0].vulnerabilityName})
    } catch (error) {
           console.error("Error:", error);
    }
} 


export default addLab;


//-------------------------------------------------



// const addLab = async (req, res, next) => {
//   try {
//     const { labs } = req.body;

//     for (const lab of labs) {
//      lab.liveUrl = await deployToRailway(lab.srcCode, lab.vulnerabilityName);

//     }

//     const vulnerability = await Vulnerability.findOneAndUpdate(
//       { name: labs[0].vulnerabilityName },
//       {},
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     const insertedLabs = await Lab.insertMany(labs);
//     await Vulnerability.findByIdAndUpdate(vulnerability._id, {
//       $push: { labs: { $each: insertedLabs.map(lab => lab._id) } }
//     });

//     console.log(`Deployed and added ${insertedLabs.length} labs to ${vulnerability.name}`);
//     return res.json({ success: true, vulnerabilityName: labs[0].vulnerabilityName });

//   } catch (error) {
//     console.error("Error in addLab:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

// export default addLab;
