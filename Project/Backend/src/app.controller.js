import connectDB from "./DB/connection.js";
import authController from '../src/modules/auth/auth.controller.js'

const bootstrap=(app,express)=>{
    app.use(express.json());
    app.get('/',(req,res,next)=>{
        return res.status(200).json({
            message:"welcome in Xhunter project..."
        })
    })
    app.use('/auth' , authController)
    app.all('*' , (req,res,next)=>{
        return res.status(404).json({
            message:'In-Valid routing!!'
        })
    })

    connectDB()
}

export default bootstrap;