import express,{Request,Response,NextFunction, Router} from "express";
import jwt  from "jsonwebtoken";
import { VerifyLoggedIn } from "./verify";
import { ContentModel, TagsModel, UserModel } from "./Schema";
import cookieParser from "cookie-parser";



const route:Router = Router();


route.use(express.json());
route.use(cookieParser());


route.post("/",VerifyLoggedIn,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const arr:Array<String> = req.body.tags;
        const arr2 = [];
        for(let i = 0 ; i < arr.length ; i++){
            const tag = await TagsModel.findOne({title:arr[i]});
            // console.log(tag);
            if(tag){
                arr2.push(tag);
            }
            else{
                const tag = await TagsModel.create({title:arr[i]});
                arr2.push(tag);
            }
        }
        const post = await ContentModel.create({
            typeLink:req.body.typeLink,
            text:req.body.text,
            link: req.body.link,
            title: req.body.title,
            heading:req.body.heading,
            textAbout:req.body.textAbout,
            varient:req.body.varient,
            tags: arr2,
            //@ts-ignore
            userId: req.body.username._id,
            CreatedAt:Date.now()
        });

        await UserModel.updateOne({
            _id:post.userId
        },{
            $push:{
                posts:post
            }
        })

        res.status(200).json({
            message:"Post Added Successfully",
            value:true
        })
        return;

    }catch(err){
        console.log(err);
        res.status(400).json({
            message:"Error Occured",
            error:err
        })
        return;
    }
})


route.get("/",VerifyLoggedIn,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const user = req.body.username;
        //@ts-ignore
        const posts = await UserModel.findById(user._id).populate([{
            path:"posts",
            populate:[
                {
                    path:"tags"
                }
            ]
        }])
        
        res.status(200).json({
            messge:"Succesfull",
            posts:posts?.posts
        })

    }catch(err){
        res.status(400).json({
            messge:"Error",
            error:err
        })
    }
})


route.delete("/",VerifyLoggedIn,async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const post = await ContentModel.deleteOne({
            _id:req.body._id
        })
        res.status(200).json({
            message:"Deleted Successfully"
        })
        return;
    } catch (error) {
        res.json(400).json({
            message:"Error Occured"
        })
    }
})


export default route;