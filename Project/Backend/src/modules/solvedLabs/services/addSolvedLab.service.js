import solvedLabs from "../../../DB/model/solvedLabs.model.js";
import Lab from "../../../DB/model/Lab.model.js";
import OpenedLabs from "../../../DB/model/openedLabs.js";
const addSolvedLab= async(req , res , next)=>{
    try {
        const userId=req.user.id;
        const {labId}=req.params;

         const checkLab = await Lab.findById(labId);
    if (!checkLab) {
      return res.status(404).json({status:'fail' , message:'lab not found!!'})
    }

        const existing = await solvedLabs.findOne({ userId,  'labs.lab': labId });
        if (existing) {
            return res.status(400).json({
              status: 'fail',
              message: 'This lab is already marked as solved by this user.',
            });
          }
  
        
       const solvedLab= await solvedLabs.findOneAndUpdate({userId:userId} ,
              { $addToSet: { labs: { lab: labId, solvedAt: new Date() } } },
             { new: true, upsert: true }
            )
            let checkIfLabInOpened= await OpenedLabs.findOne({userId:userId ,labs:labId })
            if(checkIfLabInOpened){
             let removeSolvedLabFromOpened= await OpenedLabs.findOneAndDelete({userId:userId , labs:labId} , {new:true})
             console.log('removed lab: ' + removeSolvedLabFromOpened);
            }
            
            return res.status(201).json({status:'success' , solvedLab })
        
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:'server error' , error})
    }
}


export default addSolvedLab