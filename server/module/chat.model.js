import mongoose,{Schema} from "mongoose";
const chatSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    lastmessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    participants:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
    ,
    admin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Chat=mongoose.model("Chat",chatSchema)