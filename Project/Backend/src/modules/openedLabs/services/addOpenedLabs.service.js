import Lab from "../../../DB/model/Lab.model.js";
import OpenedLabs from "../../../DB/model/openedLabs.js";

const addOpenedLab= async(req , res , next)=>{
    try {
        const userId=req.user.id;
        const {labId}=req.params;

         const checkLab = await Lab.findById(labId);
    if (!checkLab) {
      return res.status(404).json({status:'fail' , message:'lab not found!!'})
    }

        const existing = await OpenedLabs.findOne({ userId,  labs: labId });
        if (existing) {
            return res.status(400).json({
              status: 'fail',
              message: 'This lab is already marked as solved by this user.',
            });
          }
  
        
       const openedLab= await OpenedLabs.findOneAndUpdate({userId:userId} ,
              { $addToSet: { labs: labId } },
             { new: true, upsert: true }
            )
        
            return res.status(201).json({status:'success' , openedLab })
        
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:'server error' , error})
    }
}


export default addOpenedLab