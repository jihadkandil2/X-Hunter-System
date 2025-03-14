import mongoose from 'mongoose';
import dotenv from "dotenv";
import axios from 'axios'

// Load environment variables from .env
dotenv.config();

const connectDB = async () => {
    try {
        //for depugging:
        console.log("🔍 MONGODB_URI inside connectDB:", process.env.MONGODB_URI);
        const uri = process.env.MONGODB_URI;

      if (!uri) {
        throw new Error("MONGODB_URI is missing. Check your .env file.");
      }
  
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error.message);
      process.exit(1);
    }
  };  

//  const connectDB= async()=>{
//     await mongoose.connect(process.env.DB_URI).then(res=>{
//         console.log(`DB connected`);
        
//     }).catch(err=>{
//         console.error(`fail to connect` , err);
        
// })
// }

export default connectDB;

