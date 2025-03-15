
import Users from '../../../DB/model/User.model.js'
 const updateProfile= async(req,res,next)=>{
    try {

        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json({
            message:'user  data updated successfully',
            updatedUser
        })
    } catch (error) {
        return res.status(500).json({message:'error' , error})
    }
}

export default updateProfile;