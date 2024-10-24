import mongoose, { Schema } from "mongoose";

const schema:Schema = new Schema(
    {
        reciverName:String,
        trackingID:{
            type:String,
            required:[true,"Please Provide trackingId"]
        },
        email:{
            type:String,
            require:[true,"Please Provide email"]
        },
        seen:{
            type:Boolean,
            require:[true,"Please Provide Seen Value"],
            dafault:false
        },
        subject:{
            type:String,
            require:true
        }
    },
    {
        timestamps:true
    }
) 


export const Track = mongoose.models.Track || mongoose.model("Tracks",schema)