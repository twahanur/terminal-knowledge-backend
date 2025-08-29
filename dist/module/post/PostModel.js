"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const seoSchema = new mongoose_1.Schema({
    metaTitle: { type: String, required: true, maxlength: 60 },
    metaDescription: { type: String, required: true, maxlength: 160 },
    keywords: [{ type: String }],
    canonicalUrl: { type: String },
    ogImage: { type: String },
});
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tag" }],
    seo: { type: seoSchema, required: true },
    published: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", postSchema);
//# sourceMappingURL=PostModel.js.map