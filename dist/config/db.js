"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (mongoUri) => {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map