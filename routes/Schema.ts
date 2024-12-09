import mongoose from "mongoose";
import { ContentTypes } from "./ConstsEnums";

const Schema = mongoose.Schema;


type ContentPostVarient = "normal"|"important";

enum typeLinkType {
    youtube = "youtube",
    twitter = "twitter",
    instagram = "instagram",
    normalPost = "normalPost",
    link = "normalPost"
};





// interface ContentPostType{
//     id?:string;
//     typeLink?:typeLinkType;
//     text?:string;
//     link?:string;
//     title?:string;
//     heading?:string;
//     textAbout?:string;
//     tags?:Array<String>;
//     varient?:ContentPostVarient;
//     CreatedAt?:Date;
// }

const ContentPost = new Schema({
    typeLink: String,
    text:String,
	link: {type:String},
    title:String,
    heading:String,
    textAbout:String,
	tags: [{type:Schema.Types.ObjectId,ref:"tags"}],
    varient:String,
    CreatedAt:Date,
    userId: {type:Schema.Types.ObjectId,ref:"user"},
})


const Tags = new Schema({
    title:String
})

const Link = new Schema({
    hash:{type:String,unique:true},
    userId:{type:Schema.Types.ObjectId,ref:"user"},
    sharable:{type:Boolean,default:false}
})


const UserSignIn = new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String},
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    age:{type:Number,default:18},
    posts:[{type:Schema.Types.ObjectId,ref:"content"}],
    UserSignInMethod:{type:String}
})


const UserModel = mongoose.model("user",UserSignIn);
const ContentModel = mongoose.model("content",ContentPost);
const LinkModel = mongoose.model("link",Link);
const TagsModel = mongoose.model("tags",Tags);


export {UserModel,ContentModel,LinkModel,TagsModel};

