"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./module/user/authRoutes"));
const postRoutes_1 = __importDefault(require("./module/post/postRoutes"));
const categoryRoutes_1 = __importDefault(require("./module/category/categoryRoutes"));
const tagRoutes_1 = __importDefault(require("./module/tag/tagRoutes"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/tags", tagRoutes_1.default);
// Health
app.get("/", (req, res) => res.send("Blog API is running"));
// Start
(0, db_1.connectDB)(MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map