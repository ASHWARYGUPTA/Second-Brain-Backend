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
    origin: 'https://second-brain-frontend.vercel.app', // Your frontend URL
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
        if(!process.env.JWT_SECRET_KEY) {
            return;
        }
        const tokenData = req.body.token = jwt.sign(
            {
                _id:user._id.toString(),
                username:user.username
            },process.env.JWT_SECRET_KEY)
        res.cookie("token",tokenData,{
            expires:futureDate,
            secure:true,
            httpOnly:true,
            sameSite:"none"
        });
        
        res.status(200).json({
            message:"Successfull",
            value:true
        })
        return;
    }
    else{
        try {
            try {
                const userInside = await UserModel.create({
                    username:req.body.username,
                    email:req.body.email,
                    name:req.body.name
                }); 
                await LinkModel.create({
                    hash:sha256(userInside._id.toString()),
                    userId:userInside._id.toString(),
                    sharable:false
                })
                const today = new Date();
                const futureDate = new Date();

                // Add 100 days to the futureDate
                futureDate.setDate(today.getDate() + 100);
                if(!process.env.JWT_SECRET_KEY) {
                    return;
                }
                const tokenData = req.body.token = jwt.sign(
                    {
                        _id:userInside._id.toString(),
                        username:userInside.username
                    },process.env.JWT_SECRET_KEY)
                res.cookie("token",tokenData,{expires:futureDate,secure:false});
                
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