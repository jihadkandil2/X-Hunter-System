import mongoose from 'mongoose';

const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://hana:1288567227@cluster0.iyeqh.mongodb.net/XHunters').then(res=>{
        console.log(`DB connected`);
        
    }).catch(err=>{
        console.error(`fail to connect` , err);
        
})
}

export default connectDB;