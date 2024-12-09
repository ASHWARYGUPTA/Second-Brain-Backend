import express,{ Request,response,Response, Router } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { VerifyLoggedIn, verifyUserLogin } from "./verify";
import { LinkModel, UserModel } from "./Schema";
import cors from "cors";
import sha256 from "sha256";


const router:Router =  express.Router();

router.use(express.json());

router.use(cookieParser());

router.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials if needed (e.g., cookies)
  }));


router.post("/",async(req:Request,res:Response)=>{
    const user = await UserModel.findOne({
        username:req.body.username
    })

    if(user){
        const today = new Date();
        const futureDate = new Date();

        // Add 100 days to the futureDate
        futureDate.setDate(today.getDate() + 100);

        res.cookie("token",req.body.token,{expires:futureDate,secure:false});
        if(process.env.JWT_SECRET_KEY) {
            req.body.token = jwt.sign(
                {
                    _id:user._id.toString(),
                    username:user.username
                },process.env.JWT_SECRET_KEY)
        }
        res.status(200).json({
            message:"Successfull",
            value:true
        })
        return;
    }
    else{
        try {
            try {
                const user = await UserModel.create({
                    username:req.body.username,
                    email:req.body.email,
                    name:req.body.name
                }); 
                await LinkModel.create({
                    hash:sha256(user._id.toString()),
                    userId:user._id.toString(),
                    sharable:false
                })
                const today = new Date();
                const futureDate = new Date();

                // Add 100 days to the futureDate
                futureDate.setDate(today.getDate() + 100);

                res.cookie("token",req.body.token,{expires:futureDate,secure:false});
                if(process.env.JWT_SECRET_KEY) {
                    req.body.token = jwt.sign(
                        {
                            _id:user._id.toString(),
                            username:user.username
                        },process.env.JWT_SECRET_KEY)
                }
                res.status(200).json({
                    message:"Data Sent Successfully",
                    value:true
                })

            } catch (error) {
                res.status(401).json({
                    msg:error,
                    value:false
                })
                return;
            }
            
            return;
        } catch (error) {
            res.json(401).json({
                message:"An Error Occured",
                error:error,
                value:false
            })
        }
    }
})

export default router;