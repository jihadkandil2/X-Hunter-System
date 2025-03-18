import Lab from '../../../DB/model/Lab.model.js';
import Vulnerability from '../../../DB/model/vulnerability.model.js';
const getLabs=async(req,res,next)=>{
    // try{
    
    //     const labs= await Lab.find()
    //     return res.status(200).json({
    //         labs
    //     })

    // }catch(error){
    //    return res.status(500).json({message:'server error' ,error , msg:error.message })
    // }

     try{
        
            const vulns = await Vulnerability.find().populate('labs');
            const labs= await Lab.find();
            console.log(JSON.stringify({ vulns }, null, 2));
            return res.status(200).json({vulns , labs})
    
        }catch(error){
           return res.status(500).json({message:'server error' ,error , msg:error.message })
        }
}

export default getLabs;