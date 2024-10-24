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
exports.connectDB = connectDB;
exports.checkValidData = checkValidData;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB(uri, dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connect = yield mongoose_1.default.connect(uri, { dbName });
            console.log(`dbConnected to ${connect.connection.host}`);
        }
        catch (error) {
            console.log("failed while connecting db");
        }
    });
}
function checkValidData(reciver) {
    for (let metadata in reciver) {
        let isHasEmailKey = false;
        let isHasNameKey = false;
        let isHasSubjectKey = false;
        for (let key in reciver[metadata]) {
            isHasEmailKey = isHasEmailKey ? true : key === "email";
            isHasNameKey = isHasNameKey ? true : key === "name";
            isHasSubjectKey = isHasSubjectKey ? true : key === "subject";
        }
        if (!(isHasEmailKey && isHasNameKey))
            return false;
    }
    return true;
}
