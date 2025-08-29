"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../model/User"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";
/**
 * POST /api/auth/register
 * body: { name, email, password, role? }
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "name, email and password are required" });
        }
        const existing = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ error: "Email already registered" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            name,
            email: email.toLowerCase(),
            password: hashed,
            role: role ?? "author",
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });
        res
            .status(201)
            .json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.register = register;
/**
 * POST /api/auth/login
 * body: { email, password }
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "email and password required" });
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map