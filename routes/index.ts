import SignupRouter from "./Signup";
import LoginRouter from "./SignIn";
import PostsRouter from "./Content";
import ShareRouter from "./Share";
import DecodeJWT from "./DecodeJWT";
import GoogleAuth from "./GoogleAuth"
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();


const app = express();

const connect:any = async ()=>{
    if(process.env.MONGO_STRING){
        const success = await mongoose.connect(process.env.MONGO_STRING);
        if(success){
            console.log("DB Connected Succesfully");
        }
    }
}
connect();

app.use(express.json());
// app.use(cookieParser());

app.use(cors({
    origin: 'https://second-brain-frontend.vercel.app', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials if needed (e.g., cookies)
  }));

app.use(cookieParser());
app.use("/api/v1/signup",SignupRouter);
app.use("/api/v1/signin",LoginRouter);
app.use("/api/v1/content",PostsRouter);
app.use("/api/v1/sharable",ShareRouter);
app.use("/api/v1/decodeJWT",DecodeJWT);
app.use("/api/v1/googleAuth",GoogleAuth);


app.listen(process.env.PORT,()=>{
    console.log(`listing in port ${process.env.PORT}`);
})
