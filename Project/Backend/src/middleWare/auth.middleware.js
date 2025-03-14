import jwt from 'jsonwebtoken'
import User from '../DB/model/User.model.js';

export const userRoles={
    user:"user",
    admin:"admin"
}

export const authentication = ()=>{
  return  async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            const [Bearer , token]=authorization.split(" ")||[];
            if(!token || ! Bearer){
                return res.status(400).json({message:"In-Valid token components"})
            }
            let signature=undefined;
            switch (Bearer) {
                case "admin":
                    signature=process.env.TOKEN_SIGNATURE_ADMIN;
                    break;
                    case "Bearer":
                    signature=process.env.TOKEN_SIGNATURE
                    break;
            
                default:
                    break;
            }
            const decoded = jwt.verify(token, signature)
            if (!decoded?.id) {
                return res.status(400).json({ message: "In-Valid token payload" })
            }
            
            
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "not register account" })
            }
           
            req.user = user;
    
            return next();
        } catch (error) {
            if (error?.name) {
                switch (error.name) {
                    case "JsonWebTokenError":
                    case "TokenExpiredError":
                        return res.status(400).json({message:"token error" , error})
                        break;
                    default:
                        break;
                }
            }
            return res.status(500).json({ message: "server error", error })
        }
    
    
    }
}


export const authorization = (accessRoles=[])=>{
    return  async (req, res, next) => {
          try {
            if(!accessRoles.includes(req.user.role)){
             return res.status(403).json({message:'un authorized account'})
            }
            return next();
          } catch (error) {
              return res.status(500).json({ message: "server error", error })
          }
      
      
      }
  }
  
  

//  console.log({accessRoles , user:user.role});
            
// console.log(accessRoles.includes(user.role));
// if(!accessRoles.includes(user.role)){
//     return res.status(403).json({message:'un authorized account'})
// }