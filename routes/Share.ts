import express, { Router } from "express";
import { VerifyLoggedIn } from "./verify";
import { LinkModel } from "./Schema";
import { UserModel } from "./Schema";
import cookieParser from "cookie-parser";


const router:Router = express.Router();


router.use(express.json());
router.use(cookieParser());

router.use(VerifyLoggedIn);



router.post("/",async (req,res)=>{

    try {
        const _id = req.body.username._id;

        const userLink = await LinkModel.findOne({
            userId:_id, 
        })

        

        if(req.body.share && userLink){
            userLink.sharable = true;
            userLink.save();
            res.status(200).json({
                message:"Sharable turned on",
                link:`https://second-brain-frontend.vercel.app/api/v1/sharable/${userLink.hash}`
            })
        }

        else{
            userLink ? userLink.sharable = false : null;
            res.status(200).json({
                message:"Sharable turned off"
            })
        }
    } catch (error) {
        res.status(400).json({
            message:"unknown error occured",
            error:error
        })
    }
})

router.get("/:link",async(req,res)=>{
    try {
        const Link = await LinkModel.findOne({hash:req.params.link});
        if(Link){
            if(Link.sharable){
                const userToBeShared = await UserModel.findById(req.body.username._id).populate([{
                    path:"posts",
                    populate:[
                        {
                            path:"tags"
                        }
                    ]
                }]);

                res.status(200).json({
                    message:"Retrival Successful",
                    posts:userToBeShared?.posts
                }) 
                return;
            }
            else{
                res.status(300).json({
                    message:"Link can't be shared of this user"
                })
            }
            return;
            
        }
        else{
            res.status(300).json({
                message:"User not found"
            })
            return;
        }
    } catch (error) {
        res.status(400).json({
            message:"Unkown Error",
            error:error
        })
    }
})

export default router;