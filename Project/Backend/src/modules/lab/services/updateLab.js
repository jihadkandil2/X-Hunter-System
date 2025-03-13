import  Lab from '../../../DB/model/Lab.model.js';

const updateLab=async(req,res,next)=>{
    try{
        const updatedLab = await Lab.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );
        if (!updatedLab) {
            return res.status(404).json({ message: 'Lab not found' });
        }
        return res.status(200).json({
            message:'Lab updated successfully',
            updatedLab
        })

    }catch(error){
       return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
}

export default updateLab;