import solvedLabs from "../../../DB/model/solvedLabs.model.js";

const addSolvedLab= async(req , res , next)=>{
    try {
        const userId=req.user.id;
        const {labId}=req.params;
        const existing = await solvedLabs.findOne({ userId, labs: labId });
        if (existing) {
            return res.status(400).json({
              status: 'fail',
              message: 'This lab is already marked as solved by this user.',
            });
          }
        
       const solvedLab= await solvedLabs.findOneAndUpdate({userId:userId} ,
             { $addToSet: { labs: labId } },
             { new: true, upsert: true }
            )
        
            return res.status(201).json({status:'success' , solvedLab })
        
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:'server error' , error})
    }
}


export default addSolvedLab