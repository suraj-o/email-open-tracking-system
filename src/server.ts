import express, { NextFunction, Request, Response } from "express"
import { initMail } from "./utils/sendmail";
import { SendMailRequestMetaData } from "./types";
import { checkValidData, connectDB } from "./utils/database";
import { Track } from "./models/track";
import cors from "cors"
import "dotenv/config"

const server = express();

const PORT:number = +(process.env.PORT)! || 4000;
const DATABSE_URI= process.env.DATABASE_URI as string;
const DATABSE_DBNAME = "emailtracks"

connectDB(DATABSE_URI,DATABSE_DBNAME)

server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.use(cors({
    origin:"*",
    methods:["GET","POST","PUT"],
    allowedHeaders:["Content-Type"]
}))

server.post("/api/v1/mail/send",(req:Request<{},{},SendMailRequestMetaData>,
    res:Response,next:NextFunction)=>{
    try {
        const {reciver} =req.body;

        const validData= checkValidData(reciver);
        if(!validData) throw new Error("Provide valid data")

        const mailResopnse:boolean = initMail(reciver);
        if(!mailResopnse) throw new Error("failed while sending mail");

        res.status(200).json({
            success:true,
            message:"mail has been sent"
        })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
})


server.get("/api/v1/mail/seen",async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {trackingId}= req.query;
        
        const tracks = await Track.find({trackingID:trackingId!});

        if (tracks.length <= 0 ) throw new Error("invalid tracking id")
        await Track.updateMany({trackingID:trackingId},{seen:true})   
    
        res.status(200).json({
            success:true,
            message:"mail marked as seen"
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
})

server.get("/api/v1/mail/all-mails",async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const tracks = await Track.find({});
        res.status(200).json({
            success:true,
            tracks:tracks.length > 0 ? tracks : "no any tracks"
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:(error as Error).message || "internal server error"
        })
    }
})

server.listen(PORT,()=>console.log(`server is running on port ${PORT}`))