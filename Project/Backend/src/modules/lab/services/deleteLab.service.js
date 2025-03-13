import Lab from '../../../DB/model/Lab.model.js';

const deleteLab=async(req,res,next)=>{
    try{
    
        const deletedLab = await Lab.findByIdAndDelete(req.params.id);
        if (!deletedLab) {
            return res.status(404).json({ message: 'Lab not found' });
        }
        return res.status(200).json({
            message:'Lab deleted successfully',
            deletedLab
        })

    }catch(error){
       return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
}

export default deleteLab;