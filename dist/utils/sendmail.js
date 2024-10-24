"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMail = initMail;
const nodemailer_1 = require("nodemailer");
const path_1 = __importDefault(require("path"));
const track_1 = require("../models/track");
const uuid_1 = require("uuid");
require("dotenv/config");
const trasnporter = (0, nodemailer_1.createTransport)({
    host: process.env.SMTP_HOST,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
function initMail(reciver) {
    try {
        const tracking = (0, uuid_1.v4)();
        reciver.forEach((reciver) => __awaiter(this, void 0, void 0, function* () {
            Array.isArray(reciver.email) ? reciver.email.forEach((email, index) => __awaiter(this, void 0, void 0, function* () {
                yield track_1.Track.create({
                    email,
                    reciverName: reciver.name,
                    trackingID: tracking.toString(),
                    subject: reciver.subject,
                    seen: false
                });
            })) :
                yield track_1.Track.create({
                    email: reciver.email,
                    reciverName: reciver.name,
                    trackingID: tracking.toString(),
                    subject: reciver.subject,
                    seen: false
                });
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: Array.isArray(reciver.email) ? reciver.email : [reciver.email],
                subject: reciver.subject,
                html: `
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
                attachments: [
                    {
                        filename: "suraj_resume.pdf",
                        path: path_1.default.join(path_1.default.resolve(), "Suraj_Resume.pdf")
                    }
                ]
            };
            yield trasnporter.sendMail(mailOptions);
            console.log("mailsent");
        }));
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
