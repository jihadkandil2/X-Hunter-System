import Lab from "../../../DB/model/Lab.model.js";
import asmaaModel from "../../analysisAI/services/asmaa.model.js";
import Vulnerability from "../../../DB/model/vulnerability.model.js";
const addLabFromAi= async(req , res , next)=>{
    try {
        const {vulnName}=req.body
        console.log('from add lab vuln name = ' , vulnName);
        
        const AiResult=await asmaaModel(vulnName)
        const labDescription=AiResult.data["Description"];
        const labScenario=AiResult.data["Lab Scenario"];
        const vulnerabilityName= AiResult.data["Vulnerability name"];
        const labLevel=AiResult.data["Difficulty Level"];
        const srcCode=AiResult.srcCode;
        const payloads=AiResult.payloads;
        console.log({labDescription , labScenario , vulnerabilityName , labLevel , srcCode , payloads});
        const createdLab={labDescription , labScenario , vulnerabilityName , labLevel , srcCode , payloads}
        return res.status(200).json({status:'success' , createdLab})
//         if(labDescription && labScenario && vulnerabilityName && labLevel &&srcCode &&payloads ){
//             const vulnerability = await Vulnerability.findOneAndUpdate(
//             { name:vulnerabilityName }, 
//             {}, 
//             { upsert: true, new: true, setDefaultsOnInsert: true }
//         );
    
//         if(srcCode!= undefined || srcCode!='no code'){
//  const insertedLab= await Lab.insertOne({labScenario , labDescription , vulnerabilityName , labLevel , srcCode , payloads})
//         await Vulnerability.findByIdAndUpdate(vulnerability._id, { $push: { labs: insertedLab } });
//         return res.status(201).json({status:'success' , insertedLab})
//         }
//         else{
//             return res.status(400).json({statsu:'fail' , message:'source code is missing'})
//         }
       
//         }
//         else{
//             return res.status(400).json({statsu:'fail' , message:'some fields are missing'})
//         }
        
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}

export default addLabFromAi;