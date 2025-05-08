// import jwt from 'jsonwebtoken'
// import User from '../DB/model/User.model.js';

// export const userRoles={
//     user:"user",
//     admin:"admin"
// }

// export const authentication = ()=>{
//   return  async (req, res, next) => {
//         try {
//             const { authorization } = req.headers;
//             const [Bearer , token]=authorization.split(" ")||[];
//             if(!token || ! Bearer){
//                 return res.status(400).json({message:"In-Valid token components"})
//             }
//             let signature=undefined;
//             switch (Bearer) {
//                 case "admin":
//                     signature=process.env.TOKEN_SIGNATURE_ADMIN;
//                     break;
//                     case "Bearer":
//                     signature=process.env.TOKEN_SIGNATURE
//                     break;
            
//                 default:
//                     break;
//             }
//             const decoded = jwt.verify(token, signature)
//             if (!decoded?.id) {
//                 return res.status(400).json({ message: "In-Valid token payload" })
//             }
            
            
//             const user = await User.findById(decoded.id);
//             if (!user) {
//                 return res.status(404).json({ message: "not register account" })
//             }
           
//             req.user = user;
    
//             return next();
//         } catch (error) {
//             if (error?.name) {
//                 switch (error.name) {
//                     case "JsonWebTokenError":
//                     case "TokenExpiredError":
//                         return res.status(400).json({message:"token error" , error})
//                         break;
//                     default:
//                         break;
//                 }
//             }
//             return res.status(500).json({ message: "server error", error })
//         }
    
    
//     }
// }


// export const authorization = (accessRoles=[])=>{
//     return  async (req, res, next) => {
//           try {
//             if(!accessRoles.includes(req.user.role)){
//              return res.status(403).json({message:'un authorized account'})
//             }
//             return next();
//           } catch (error) {
//               return res.status(500).json({ message: "server error", error })
//           }
      
      
//       }
//   }
  

import jwt from 'jsonwebtoken';
import User from '../DB/model/User.model.js';

export const userRoles = {
  user: "user",
  admin: "admin"
};

// 🔐 Auth Middleware (Token verification)
export const authentication = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith('Bearer ') && !authorization.startsWith('admin ')) {
        return res.status(400).json({ message: "Invalid or missing token" });
      }

      const [type, token] = authorization.split(" ");
      let signature;

      switch (type) {
        case "Bearer":
          signature = process.env.TOKEN_SIGNATURE; // For normal users
          break;
        case "admin":
          signature = process.env.TOKEN_SIGNATURE_ADMIN; // For admins
          break;
        default:
          return res.status(400).json({ message: "Invalid token type" });
      }

      const decoded = jwt.verify(token, signature);
      if (!decoded?.id) {
        return res.status(400).json({ message: "Invalid token payload" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      return next();
    } catch (error) {
      const name = error?.name;
      if (name === "JsonWebTokenError" || name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token is invalid or expired", error });
      }
      return res.status(500).json({ message: "Server error", error });
    }
  };
};

// 🔒 Authorization Middleware (Role-based access control)
export const authorization = (accessRoles = []) => {
  return (req, res, next) => {
    try {
      if (!accessRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      return next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
};

export const updateActivity = async (req, res, next) => {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { lastLogin: new Date(), isOnline: true });
    }
    next();
  };
