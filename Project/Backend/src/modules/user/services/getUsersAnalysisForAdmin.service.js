import User from "../../../DB/model/User.model.js";
import { getSolvedLabLevelStats } from "../../solvedLabs/services/utility.service.js";

const getUsersAnalysis= async(req , res , next)=>{
    try {
        const totalUsers= await User.find();
        const stats = await getSolvedLabLevelStats();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const inactiveUsers = await User.find({ lastLogin: { $lt: oneWeekAgo } },{_id:1});
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const veryInactiveUsers = await User.find({ lastLogin: { $lt: oneMonthAgo } },{_id:1});
        const onlineUsers = await User.find({ isOnline: true },{_id:1});

        return res.status(200).json({totalUsers:totalUsers.length,activeUsers:onlineUsers.length,inactiveUsers:veryInactiveUsers.length , ...stats})

        
    } catch (error) {
        console.error('Analysis Error:', error); // Log it properly
    return res.status(500).json({
        status: 'fail',
        message: 'server error',
        error: error.message || error
    });
    }
}


export default getUsersAnalysis