import User from "../../../DB/model/User.model.js"
import bcrypt from 'bcrypt'
const deleteAccount=async(req , res , next)=>{
    try {
        const {oldPassword}=req.body;
        const checkUser=await User.findById(req.params.id);
        console.log(checkUser.password);
        const match=bcrypt.compareSync(oldPassword , checkUser.password)
        if(!match){
            return res.status(404).json({message: 'incorrect password'})
        }
        console.log("matched");
        
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