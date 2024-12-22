import express, { Router } from "express";
import {Request,Response,NextFunction } from "express";
import { UserSignInZod } from "./zodSchema";
import * as bcrypt from "bcrypt";
import { LinkModel, UserModel } from "./Schema";
import sha256 from "sha256";
import cors from "cors";


const router:Router = express.Router();

router.use(express.json());
router.use(cors());

const ValidateInput = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        UserSignInZod.parse(req.body);
        req.body.password = await bcrypt.hash(req.body.password,5);
        next();
    }catch(err:any){
        res.status(411).json({
            message:err
        })
    }
}


router.post("/",ValidateInput,async (req:Request,res:Response)=>{     
    try {
        try {
            const user = await UserModel.create(req.body); 
            await LinkModel.create({
                hash:sha256(user._id.toString()),
                userId:user._id.toString(),
                sharable:false
            })
        } catch (error) {
            res.status(401).json({
                msg:error
            })
            return;
        }
        
        res.status(200).json({
            message:"Data Sent Successfully",
            value:true
        })
        return;
    } catch (error) {
        res.json(401).json({
            message:"An Error Occured",
            error:error,
            value:false
        })
    }


})

export default router;
