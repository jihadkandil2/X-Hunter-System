import Lab from '../../../DB/model/Lab.model.js';
import Vulnerability from '../../../DB/model/vulnerability.model.js';
import fs from 'fs';
import connectDB from '../../../DB/connection.js';

const jsonData = JSON.parse(fs.readFileSync('labs.json', 'utf-8'));

//  const addLab=async(req,res,next)=>{
//     try{
//         const {labScenario , labDescription , vulnerabilityName , labLevel , srcCode} = req.body;
//         const lab= await Lab.create({labScenario,labDescription, vulnerabilityName ,labLevel,srcCode})
//         return res.status(201).json({
//             message:'Done',
//             lab
//         })

//     }catch(error){
//        return res.status(500).json({message:'server error' ,error , msg:error.message })
//     }
// }



// ------------------------------------------------------------------------------------------------------------------------------

// const addLab=async(req,res,next)=>{
//     try {
//         const vulnerability = await Vulnerability.findOneAndUpdate(
//             { name: jsonData.name }, 
//             {}, 
//             { upsert: true, new: true, setDefaultsOnInsert: true }
//         );
//         const labsData = jsonData.labs.map(lab => ({ ...lab, vulnerability: vulnerability._id }));
//         const insertedLabs = await Lab.insertMany(labsData);
//         await Vulnerability.findByIdAndUpdate(vulnerability._id, { $push: { labs: { $each: insertedLabs.map(lab => lab._id) } } });//.map(lab => lab.labScenario)
//         console.log(`Added ${insertedLabs.length} labs to ${vulnerability.name}`);

//     } catch (error) {
//            console.error("Error:", error);
//     }
// }






// -------------------------------------------------------------------------------------------------------------




const addLab=async(req,res,next)=>{
    try {
        const vulnerability = await Vulnerability.findOneAndUpdate(
            { name: jsonData.labs[0].vulnerabilityName }, 
            {}, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        const labsData = jsonData.labs.map(lab => ({ ...lab, vulnerability: vulnerability._id }));
        // const insertedLabs = await Lab.insertMany(labsData);
        // await Vulnerability.findByIdAndUpdate(vulnerability._id, { $push: { labs: { $each: insertedLabs.map(lab => lab._id) } } });
        // console.log(`Added ${insertedLabs.length} labs to ${vulnerability.name}`);
        return res.json({vulnerabilityName:jsonData.labs[0].vulnerabilityName})
    } catch (error) {
           console.error("Error:", error);
    }
}


export default addLab;
