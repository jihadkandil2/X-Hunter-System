import mongoose from 'mongoose';
import axios from 'axios'
const connectDB= async()=>{
    await mongoose.connect(process.env.DB_URI).then(res=>{
        console.log(`DB connected`);
        
    }).catch(err=>{
        console.error(`fail to connect` , err);
        
})
}

export default connectDB;