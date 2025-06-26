import Vulnerability from "../../../DB/model/vulnerability.model.js";
import Lab from "../../../DB/model/Lab.model.js";

const insertLabIntoDatabase=async(req , res , next)=>{
    try {
        const {labDescription ,labScenario , vulnerabilityName , labLevel ,srcCode , payloads  } = req.body
        if(labDescription && labScenario && vulnerabilityName && labLevel &&srcCode &&payloads ){
            const vulnerability = await Vulnerability.findOneAndUpdate(
            { name:vulnerabilityName }, 
            {}, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if(srcCode!= undefined || srcCode!='no code'){
         const insertedLab= await Lab.insertOne({labScenario , labDescription , vulnerabilityName , labLevel , srcCode , payloads})
                await Vulnerability.findByIdAndUpdate(vulnerability._id, { $push: { labs: insertedLab } });
                return res.status(201).json({status:'success' , insertedLab})
                }
                else{
                    return res.status(400).json({statsu:'fail' , message:'source code is missing'})
                }
        } else{
            return res.status(400).json({statsu:'fail' , message:'some fields are missing'})
        }

    } catch (error) {
          return res.status(500).json({status:'fail' , message:error.message})
    }
    
}

export default insertLabIntoDatabase