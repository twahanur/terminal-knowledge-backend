"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        console.log(name, slug);
        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }
        const exists = await Category_1.default.findOne({ slug });
        if (exists)
            return res.status(400).json({ error: "Slug already exists" });
        const category = new Category_1.default({ name, slug });
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
        const categories = await Category_1.default.find().sort({ createdAt: -1 });
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=categoryController.js.map