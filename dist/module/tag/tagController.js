"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = exports.createTag = void 0;
const TagModel_1 = __importDefault(require("./TagModel"));
const createTag = async (req, res) => {
    try {
        const { name, slug } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }
        const exists = await TagModel_1.default.findOne({ slug });
        if (exists)
            return res.status(400).json({ error: "Slug already exists" });
        const tag = new TagModel_1.default({ name, slug });
        const saved = await tag.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.createTag = createTag;
const getTags = async (req, res) => {
    try {
        const tags = await TagModel_1.default.find().sort({ createdAt: -1 });
        res.json(tags);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getTags = getTags;
//# sourceMappingURL=tagController.js.map