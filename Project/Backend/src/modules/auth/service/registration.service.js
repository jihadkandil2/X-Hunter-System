import Users from '../../../DB/model/User.model.js'
import bcrypt from 'bcrypt'
import cryptoJs from 'crypto-js'
export const signup=async(req,res,next)=>{
try{
    const {name , email, password , confirmationPassword , phone} = req.body;
    if(password !== confirmationPassword){
        return res.status(400).json({message: 'password mismatch confirmation Password!!'})
    }

    // check if there's user with that email
    const ckeckUser=await Users.findOne({email})
    if(ckeckUser){
        return res.status(409).json({message: 'email already exists!!'})
    }

    //we will hash the password first 
    const hashPassword=bcrypt.hashSync(password , 8)
    const encryptphone=cryptoJs.AES.encrypt(phone , 'xHunters').toString();
    // now we wil ad user to the database
    const user = await Users.create({name , email , password:hashPassword , phone:encryptphone})

    return res.status(201).json({
        message:'Done',
        Users,
        user
    })
    
}catch(error){
    return res.status(500).json({message:'server error' ,error , msg:error.message })
}
}


export const login=async(req,res,next)=>{
    try{
        const { email, password} = req.body;
    
        // check if user exist
        const user=await Users.findOne({email})
        if(!user){
            return res.status(404).json({message: 'In-valid login data'})
        }
        //we will hash the password of this user and compare the similarity
        const match=bcrypt.compareSync(password , user.password)
        if(!match){
            return res.status(404).json({message: 'In-valid login data'})
        }
        user.phone=cryptoJs.AES.decrypt(user.phone , 'xHunters').toString(cryptoJs.enc.Utf8)
        return res.status(200).json({
            message:'Done',
            user
        })
        
    }catch(error){
        return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
    }