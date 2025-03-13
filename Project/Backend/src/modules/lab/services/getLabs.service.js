import Lab from '../../../DB/model/Lab.model.js';

const getLabs=async(req,res,next)=>{
    try{
    
        const labs= await Lab.find()
        return res.status(200).json({
            labs
        })

    }catch(error){
       return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
}

export default getLabs;