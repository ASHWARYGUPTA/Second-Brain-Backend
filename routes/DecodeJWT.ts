import express,{Request,Response} from "express";
import jwt  from "jsonwebtoken";



const route = express.Router();


route.get("/",(req:Request,res:Response)=>{
    const token = req.headers["token"];
    if(!token){
        res.json({
            message:"wrong token"
        })
        return;
    }

    res.status(200).json({
        message:"Sucess",
        //@ts-ignore
        decoded:jwt.decode(token)
    })
})

export default route;