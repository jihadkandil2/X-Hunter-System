import connectDB from "./DB/connection.js";

import cors from "cors";
import authController from '../src/modules/auth/auth.controller.js'

const bootstrap=(app,express)=>{
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5173", // Allow your frontend origin
        // You can also use origin: "*" in development, but it's less secure
      }));
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