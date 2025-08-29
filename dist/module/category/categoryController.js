"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostByCategories = exports.getCategories = exports.createCategory = void 0;
const CategoryModel_1 = __importDefault(require("./CategoryModel"));
const PostModel_1 = __importDefault(require("../post/PostModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        console.log(name, slug);
        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }
        const exists = await CategoryModel_1.default.findOne({ slug });
        if (exists)
            return res.status(400).json({ error: "Slug already exists" });
        const category = new CategoryModel_1.default({ name, slug });
        const saved = await category.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel_1.default.find().sort({ createdAt: -1 });
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getCategories = getCategories;
const getPostByCategories = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    try {
        const posts = await PostModel_1.default.find({ category: id })
            .sort({ createdAt: -1 })
            .populate("author")
            .populate("category")
            .populate("tags")
            .exec();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getPostByCategories = getPostByCategories;
//# sourceMappingURL=categoryController.js.map