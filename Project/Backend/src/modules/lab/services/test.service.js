import Lab from '../../../DB/model/Lab.model.js';
import Vulnerability from '../../../DB/model/vulnerability.model.js';
const fetsh=async(req,res,next)=>{
    try{
    
        const vulns = await Vulnerability.find().populate('labs');
        console.log(JSON.stringify({ vulns }, null, 2));
        return res.status(200).json({vulns})

    }catch(error){
       return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
}

export default fetsh;