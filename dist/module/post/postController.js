"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.addPost = exports.getPostById = exports.getAllPosts = void 0;
const PostModel_1 = __importDefault(require("./PostModel"));
const slugfy_1 = require("../../utils/slugfy");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * GET /api/posts
 */
const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel_1.default.find()
            .populate("author", "name email")
            .populate("category", "name slug")
            .populate("tags", "name slug")
            .exec();
        const data = {
            posts,
            seo: {
                metaTitle: "Terminal Knowledge | Modern Tech & Programming Insights",
                metaDescription: "Explore in-depth articles on web development, AI, cloud computing, and more. Terminal Knowledge is your source for modern tech insights and practical programming guides.",
                keywords: [
                    "programming blog",
                    "tech blog",
                    "web development",
                    "cloud computing",
                    "AI",
                    "cybersecurity",
                    "devops",
                    "startups",
                    "IT career",
                    "programming resources",
                ],
                canonicalUrl: "https://terminalknowledge.com",
                ogImage: "https://terminalknowledge.com/images/terminal-knowledge-homepage-og.jpg",
            },
        };
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getAllPosts = getAllPosts;
/**
 * GET /api/posts/:id
 */
const getPostById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(400).json({ error: "Invalid ID" });
    try {
        const post = await PostModel_1.default.findById(id)
            .populate("author")
            .populate("category")
            .populate("tags")
            .exec();
        if (!post)
            return res.status(404).json({ error: "Post not found" });
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.getPostById = getPostById;
/**
 * POST /api/posts
 * Protected - author or admin
 * multipart/form-data with optional image field named "image"
 */
const addPost = async (req, res) => {
    try {
        const { title, slug, content, category, tags, seo, published } = req.body;
        if (!title || !content || !category || !seo) {
            return res
                .status(400)
                .json({ error: "title, content, category and seo are required" });
        }
        const finalSlug = slug ? slug.toString() : (0, slugfy_1.generateSlug)(title);
        // Parse tags safely
        let parsedTags = [];
        if (tags) {
            if (typeof tags === "string") {
                try {
                    parsedTags = JSON.parse(tags);
                    if (!Array.isArray(parsedTags)) {
                        return res.status(400).json({ error: "Tags must be an array" });
                    }
                }
                catch {
                    return res.status(400).json({ error: "Invalid tags JSON" });
                }
            }
            else if (Array.isArray(tags)) {
                parsedTags = tags;
            }
        }
        // Parse SEO safely
        let parsedSeo;
        if (typeof seo === "string") {
            try {
                parsedSeo = JSON.parse(seo);
            }
            catch {
                return res.status(400).json({ error: "Invalid SEO JSON" });
            }
        }
        else {
            parsedSeo = seo;
        }
        console.log(req.file?.path);
        // Create post
        const postDoc = await PostModel_1.default.create({
            title,
            slug: finalSlug,
            content,
            author: req.user?.id ?? "68ae1145a564344c2e6e03fb",
            category,
            tags: parsedTags,
            seo: parsedSeo,
            featuredImage: req.file?.path,
            published: published === "true" || published === true,
        });
        // No populate since schema fields are strings
        res.status(201).json(postDoc);
    }
    catch (err) {
        res.status(400).json({
            error: "Invalid data",
            details: err instanceof Error ? err.message : err,
        });
    }
};
exports.addPost = addPost;
/**
 * PUT /api/posts/:id
 * Protected - author or admin. If author, must own the post.
 */
const updatePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    try {
        const existing = await PostModel_1.default.findById(id);
        if (!existing)
            return res.status(404).json({ error: "Post not found" });
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (req.user.role !== "admin" &&
            existing.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const { title, slug, content, category, tags, seo, published } = req.body;
        if (title)
            existing.title = title;
        if (slug)
            existing.slug = slug;
        if (content)
            existing.content = content;
        if (category)
            existing.category = category;
        // Tags
        if (tags) {
            if (typeof tags === "string") {
                try {
                    existing.tags = JSON.parse(tags);
                }
                catch {
                    return res.status(400).json({ error: "Invalid tags JSON" });
                }
            }
            else
                existing.tags = tags;
        }
        // SEO
        if (seo) {
            if (typeof seo === "string") {
                try {
                    existing.seo = JSON.parse(seo);
                }
                catch {
                    return res.status(400).json({ error: "Invalid SEO JSON" });
                }
            }
            else
                existing.seo = seo;
        }
        if (published !== undefined)
            existing.published = published === "true" || published === true;
        // if (req.file?.path) existing.featuredImage = req.file.path;
        await existing.save();
        // Populate using a new query
        const populated = await PostModel_1.default.findById(existing._id)
            .populate("author", "name email")
            .populate("category", "name slug")
            .populate("tags", "name slug")
            .exec();
        res.json(populated);
    }
    catch (err) {
        res.status(400).json({
            error: "Invalid update request",
            details: err instanceof Error ? err.message : err,
        });
    }
};
exports.updatePost = updatePost;
/**
 * DELETE /api/posts/:id
 * Protected - admin or author (owner)
 */
const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(400).json({ error: "Invalid ID" });
    try {
        const existing = await PostModel_1.default.findById(id);
        if (!existing)
            return res.status(404).json({ error: "Post not found" });
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (req.user.role !== "admin" &&
            existing.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        await PostModel_1.default.findByIdAndDelete(id);
        res.json({ message: "Post deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map