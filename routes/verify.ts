import {Request,Response,NextFunction} from "express";
import bcrypt from "bcrypt";
import jwt, { JwtHeader } from "jsonwebtoken";
import { UserModel } from "./Schema";
import cookieParser from "cookie-parser";




const verifyUserLogin = async (req:Request,res:Response,next:NextFunction)=>{
    const user = await UserModel.findOne({username:req.body.username});

    if(user){
        if(!user.password) return;
        const comparePass = await bcrypt.compare(req.body.password,user.password);
        if(comparePass){
            if(process.env.JWT_SECRET_KEY) {
                req.body.token = jwt.sign(
                    {
                        _id:user._id.toString(),
                        username:user.username
                    },process.env.JWT_SECRET_KEY)
                next();
            }
        }
        else{
            res.status(401).json({
                message:"Wrong Password",
                value:false
            })
        }
    }

    else{
        res.status(401).json({
            message:"Wrong Username",
            value:false
        })
    }
}

const VerifyLoggedIn = async (req:Request,res:Response,next:NextFunction)=>{
    
    if(!req.cookies.token){
        res.status(400).json({
            value:false,
            msg:"token not found"
        })
        
        return;
    }

    try {
        
        const verifyUser:any = process.env.JWT_SECRET_KEY?jwt.verify(req.cookies.token,process.env.JWT_SECRET_KEY):false;

        if(verifyUser){
            req.body.username = jwt.decode(req.cookies.token);
            // console.log("data sent");
            next();
        }
    } catch (error) {
        res.status(400).json({
            message:"Invalid User",
            value:false
        })
    }
    

    

    
}


export {verifyUserLogin,VerifyLoggedIn}