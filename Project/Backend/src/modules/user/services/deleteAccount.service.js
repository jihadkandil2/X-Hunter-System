import User from "../../../DB/model/User.model.js"
const deleteAccount=async(req , res , next)=>{
    try {
        const deletedUser=await User.findByIdAndDelete(
            req.params.id,
            { new: true } 
        )
        if(!deletedUser){
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json({
            message:'user  deleted successfully',
            deletedUser
        })
    } catch (error) {
        return res.status(500).json({message:'error' , error})
    }
}

export default deleteAccount;