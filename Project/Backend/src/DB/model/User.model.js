import mongoose, {Schema , model} from 'mongoose';
import { userRoles } from '../../middleWare/auth.middleware.js';


const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'name is required'],
        minlength: 3,
        maxlength: 25,
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true,'email already exists'],
        // match: [/\S+@\S+\.\S+/, 'Invalid email address'],
      },
      password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6,
        maxlength: 100
      },
      gender:{
        type: String,
        enum:['male', 'female'],
        default:'male'
      },
      DOB:Date,
      image:String,
      confirmEmail:{
        type:Boolean,
        default:false
      },
      role:{
        type: String,
        enum:Object.values(userRoles),
        default:userRoles.user
      }
    },
    { timestamps: true } 
  );

const User= model('User' , userSchema)|| mongoose.models.User  ;



export default User;