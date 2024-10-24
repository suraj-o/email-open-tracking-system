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
const express_1 = __importDefault(require("express"));
const sendmail_1 = require("./utils/sendmail");
const database_1 = require("./utils/database");
const track_1 = require("./models/track");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const server = (0, express_1.default)();
const PORT = +(process.env.PORT) || 4000;
const DATABSE_URI = process.env.DATABASE_URI;
const DATABSE_DBNAME = "emailtracks";
(0, database_1.connectDB)(DATABSE_URI, DATABSE_DBNAME);
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: false }));
server.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"]
}));
server.post("/api/v1/mail/send", (req, res, next) => {
    try {
        const { reciver } = req.body;
        const validData = (0, database_1.checkValidData)(reciver);
        if (!validData)
            throw new Error("Provide valid data");
        const mailResopnse = (0, sendmail_1.initMail)(reciver);
        if (!mailResopnse)
            throw new Error("failed while sending mail");
        res.status(200).json({
            success: true,
            message: "mail has been sent"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
server.get("/api/v1/mail/seen", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackingId } = req.query;
        const tracks = yield track_1.Track.find({ trackingID: trackingId });
        if (tracks.length <= 0)
            throw new Error("invalid tracking id");
        yield track_1.Track.updateMany({ trackingID: trackingId }, { seen: true });
        res.status(200).json({
            success: true,
            message: "mail marked as seen"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}));
server.get("/api/v1/mail/all-mails", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tracks = yield track_1.Track.find({});
        res.status(200).json({
            success: true,
            tracks: tracks.length > 0 ? tracks : "no any tracks"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
}));
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
