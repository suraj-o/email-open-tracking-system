import mongoose from "mongoose";
import { SendMailRequestMetaData } from "../types";


export async function connectDB(uri:string,dbName:string){
    try {
        const connect = await mongoose.connect(uri as string,{ dbName })
        console.log(`dbConnected to ${connect.connection.host}`);
        
    } catch (error) {
        console.log("failed while connecting db");    
    }
}


export function checkValidData(reciver:SendMailRequestMetaData["reciver"]):boolean{
    for(let metadata in reciver){
        let isHasEmailKey:boolean=false;
        let isHasNameKey:boolean=false;
        let isHasSubjectKey:boolean=false;

        for(let key in reciver[metadata]){
             isHasEmailKey = isHasEmailKey?true : key === "email";
             isHasNameKey =  isHasNameKey?true : key === "name";
             isHasSubjectKey =  isHasSubjectKey?true : key === "subject";
             
            }
            if(!(isHasEmailKey! && isHasNameKey!)) return false;   
    }

    return true
}