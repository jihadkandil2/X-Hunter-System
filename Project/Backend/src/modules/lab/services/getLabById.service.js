import Lab from '../../../DB/model/Lab.model.js';

const getLabById=async(req,res,next)=>{

     try{
            const lab= await Lab.findById(req.params.id)
           if(!lab){
            return res.status(404).json({message:"lab not found"})
           }
            return res.status(200).json({lab})
    
        }catch(error){
           return res.status(500).json({message:'server error' ,error , msg:error.message })
        }
}

export default getLabById;