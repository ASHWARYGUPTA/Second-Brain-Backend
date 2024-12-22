import express,{ Request,response,Response, Router } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { VerifyLoggedIn, verifyUserLogin } from "./verify";
import { UserModel } from "./Schema";
import cors from "cors";


const router:Router =  express.Router();

router.use(express.json());

router.use(cookieParser());

router.use(cors({
    origin: 'https://second-brain-frontend.vercel.app', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials if needed (e.g., cookies)
    
  }));


router.post("/",verifyUserLogin,async (req:Request,res:Response)=>{
    const today = new Date();
    const futureDate = new Date();

    // Add 100 days to the futureDate
    futureDate.setDate(today.getDate() + 100);


    res.cookie("token",req.body.token,{
        expires:futureDate,
        secure:true,
        httpOnly:true,
        sameSite:"none"
    });
    if(req.body.token){
        res.status(200).json({
            token:req.body.token,
            decoded:jwt.decode(req.body.token),
            message:"Successfull",
            value:true
        })
    }
    else{
        res.status(400).json({
            message:"Error Occured",
            value:false
        })
    }
})


router.use(cookieParser());
router.get("/",VerifyLoggedIn,async (req,res)=>{
    // console.log(req.cookies);
    // await new Promise((resolver)=>setTimeout(resolver,5000));
    res.status(200).json({
        value:true,
        message:"verified"
    })
})

router.get("/logout",VerifyLoggedIn,async (req,res)=>{
    // Set token to none and expire after 5 seconds
    try{
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 1 * 1000),
            httpOnly: true,
            secure:true,
            sameSite:"none"
        })
    
        res.status(200).json({
            value:true,
            message:"Logged Out Successfully"
        })
    }catch(err){
        res.status(400).json({
            value:false,
            message:"Error Occured"
        })
    }

})


router.get("/findUser",async (req,res)=>{
    const user = await UserModel.findOne({
        username:req.headers["user"]
    })

    if(user){
        res.status(200).json({
            message:"user found",
            value:true
        })
    }
    else{
        res.status(200).json({
            message:"user not found",
            value:false
        })
    }
})

router.get("/findEmail",async (req,res)=>{
    const user = await UserModel.findOne({
        email:req.headers["email"]
    })

    if(user){
        res.status(200).json({
            message:"user found",
            value:true
        })
    }
    else{
        res.status(200).json({
            message:"user not found",
            value:false
        })
    }
})



export default router;
