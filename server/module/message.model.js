import mongoose from "mongoose";
import { Schema } from "mongoose";
const messageSchema=new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String
    },
    attachment:{
        type:[
            {
              url: String,
              localPath: String,
            },
          ],
        default:[]
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    }
},{timestamps:true})

export const Message=mongoose.model("Message",messageSchema)