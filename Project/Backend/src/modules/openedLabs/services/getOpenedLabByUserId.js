import Lab from "../../../DB/model/Lab.model.js";
import OpenedLabs from "../../../DB/model/openedLabs.js";

const getOpenedLabs= async(req , res , next)=>{
    try {
        let userId= req.user.id;
        let userData= await OpenedLabs.findOne({userId:userId})
        let labsIds= userData.labs;
        if(!labsIds){
            return res.status(404).json({status:'fail' , message:'this user has no opened labs'})
        }
        const labs = await Lab.find({ _id: { $in: labsIds } });
        return res.status(200).json({status:'success' , openedLabs:labs})
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }


}

export default getOpenedLabs