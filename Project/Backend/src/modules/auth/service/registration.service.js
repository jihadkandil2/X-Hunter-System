import Users from '../../../DB/model/User.model.js'
import bcrypt from 'bcrypt'
import cryptoJs from 'crypto-js'
import jwt from 'jsonwebtoken'
export const signup=async(req,res,next)=>{
try{
    const {name , email, password , confirmationPassword } = req.body;
    if(password !== confirmationPassword){
        return res.status(400).json({message: 'password mismatch confirmation Password!!'})
    }

    // check if there's user with that email
    const ckeckUser=await Users.findOne({email})
    if(ckeckUser){
        return res.status(409).json({message: 'email already exists!!'})
    }

    //we will hash the password first 
    const hashPassword=bcrypt.hashSync(password , parseInt(process.env.SALT))
    // const encryptphone=cryptoJs.AES.encrypt(phone , 'xHunters').toString();
    // now we wil ad user to the database
    const user = await Users.create({name , email , password:hashPassword})

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
       const token =jwt.sign({id:user._id , isloggedIn:true} ,process.env.TOKEN_SIGNATURE ,{expiresIn:'1h'})
        return res.status(200).json({
            message:'Done',
            token
        })
        
    }catch(error){
        return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
    }