
import Users from '../../../DB/model/User.model.js'
import bcrypt from 'bcrypt'

const updateProfile = async (req, res, next) => {
    try {
        const { oldPassword , newPassword } = req.body;

        if (oldPassword) {
            const user = await Users.findById(req.params.id)
            if (!user) return res.status(404).json({ error: "User not found" });
            const match = bcrypt.compareSync(oldPassword, user.password)
            if (!match) {
                return res.status(404).json({ message: 'incorrect password' })
            }
            user.password=bcrypt.hashSync(newPassword , parseInt(process.env.SALT))
            await user.save();
        }
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json({
            message: 'user  data updated successfully',
            updatedUser
        })
    } catch (error) {
        return res.status(500).json({ message: 'error', error })
    }
}

export default updateProfile;