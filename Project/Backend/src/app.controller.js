import connectDB from "./DB/connection.js";

import cors from "cors";
import authController from '../src/modules/auth/auth.controller.js'
import analysisController from '../src/modules/analysisAI/analysisAI.controller.js'
import labController from '../src/modules/lab/lab.controller.js'
import userController from '../src/modules/user/user.controller.js'
import solvedLabsController from '../src/modules/solvedLabs/solvedLabs.controller.js'
import { updateActivity } from "./middleWare/auth.middleware.js";
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
    app.use(updateActivity);
    app.use('/auth' , authController)
    app.use(analysisController)
    app.use('/labs' , labController)
    app.use('/user' ,userController)
    app.use('/solved' , solvedLabsController)


    app.all('*' , (req,res,next)=>{
        return res.status(404).json({
            message:'In-Valid routing!!'
        })
    })

    connectDB()
}

export default bootstrap;