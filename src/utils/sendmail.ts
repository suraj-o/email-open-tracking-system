import { createTransport } from "nodemailer";
import path from "path"
import { SendMailRequestMetaData } from "../types";
import { Track } from "../models/track";
import {v4} from "uuid"
import "dotenv/config"


const trasnporter= createTransport({
    host:process.env.SMTP_HOST as string,
    secure:true,
    auth:{
        user:process.env.SMTP_USER as string,
        pass:process.env.SMTP_PASS as string
    }
})

export function initMail(reciver:SendMailRequestMetaData["reciver"]):boolean{
   try {
    const tracking =v4();
    reciver.forEach(async (reciver)=>{
        Array.isArray(reciver.email) ? reciver.email.forEach(async(email,index)=>{
            await Track.create({
                email,
                reciverName:reciver.name,
                trackingID:tracking.toString(),
                subject:reciver.subject,
                seen:false
           })
        }):
        await Track.create({
            email:reciver.email,
            reciverName:reciver.name,
            trackingID:tracking.toString(),
            subject:reciver.subject,
            seen:false
       })

        const mailOptions={
            from:process.env.SMTP_USER as string,
            to:Array.isArray(reciver.email)?reciver.email:[reciver.email],
            subject:reciver.subject,
            html:`
                <section>
                    <p style="text-transform: capitalize">Hi ${reciver.name}</p>
                  <section>
                     I hope you're doing well. My name is Suraj, and I am in my third year of BCA at Tilak Maharashtra Vidyapeeth. I am passionate about full-stack development and have gained solid experience in building both front-end and back-end applications using React, Next.js, Node.js, AWS, and Docker.
                 <section>
    
                 <section>
                    <h4>
                        Some highlights of my experience include:
                    </h4>
                    <ol>
                        <li>Front-End: Building responsive and dynamic UIs with React and Next.js.</li>
    
                        <li>Back-End: Developing APIs and services using Node.js, and Express, and working with  SQL databases.</li>
    
                        <li>Cloud & DevOps: Deploying applications using AWS services (S3, ECS, Lambda) and managing containers with Docker.</li>
    
                        <li> Version Control & Collaboration: Experience with Git, GitHub, and working in team  environmens.</li>
                    </ol>
                 </section>
    
                 <p>
                     I am eager to apply my full-stack development skills professionally and contribute to meaningful projects. My passion for learning and ability to adapt quickly to new technologies make me a strong fit for your team.
                 </p>
    
                 <p>
                   Would it be possible to schedule a brief meeting to discuss how I could add value to your projects? I do love the opportunity to contribute and grow with your organization.
        
                 </p>
    
                 <p>Thank you for your time, and I look forward to connecting with you!</p>
                 <p>Best regards</p>
    
                  <section style="display:"flex; flex-direction:column; gap:-10px">
                        <p style="font-weight:400;">Suraj</p>
                        <p style="font-weight:400;">suraj222615@gmail.com</p>
                        <p style="font-weight:400;">8287562288</p>
                  </section>
                  <img style="display:none;" src=${process.env.BASE_URL}/api/v1/mail/seen?trackingId=${tracking} alt="img"/>

            </section>
                `,
            attachments:[
                {
                    filename:"suraj_resume.pdf",
                    path:path.join(path.resolve(),"Suraj_Resume.pdf")
                }
            ]
        }
        await trasnporter.sendMail(mailOptions);
        console.log("mailsent");
    })

    return true

   } catch (error) {
    console.log(error)
    return false
   }
}