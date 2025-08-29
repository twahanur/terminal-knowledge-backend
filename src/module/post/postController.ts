import { Request, Response } from "express";
import Post from "./PostModel";
import { AuthRequest } from "../../middleware/auth";
import { generateSlug } from "../../utils/slugfy";
import mongoose from "mongoose";

/**
 * GET /api/posts
 */
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .exec();
      const data = {
        posts,
        seo: {
          metaTitle: "Terminal Knowledge | Modern Tech & Programming Insights",
          metaDescription:
            "Explore in-depth articles on web development, AI, cloud computing, and more. Terminal Knowledge is your source for modern tech insights and practical programming guides.",
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
          ogImage:
            "https://terminalknowledge.com/images/terminal-knowledge-homepage-og.jpg",
        },
      };
      res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

/**
 * GET /api/posts/:id
 */
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "Invalid ID" });

  try {
    const post = await Post.findById(id)
      .populate("author")
      .populate("category")
      .populate("tags")
      .exec();
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};


/**
 * POST /api/posts
 * Protected - author or admin
 * multipart/form-data with optional image field named "image"
 */
export const addPost = async (req: any, res: Response) => {
  try {

    const { title, slug, content, category, tags, seo, published } = req.body;

    if (!title || !content || !category || !seo) {
      return res
        .status(400)
        .json({ error: "title, content, category and seo are required" });
    }

    const finalSlug = slug ? slug.toString() : generateSlug(title);

    // Parse tags safely
    let parsedTags: string[] = [];
    if (tags) {
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
          if (!Array.isArray(parsedTags)) {
            return res.status(400).json({ error: "Tags must be an array" });
          }
        } catch {
          return res.status(400).json({ error: "Invalid tags JSON" });
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Parse SEO safely
    let parsedSeo: any;
    if (typeof seo === "string") {
      try {
        parsedSeo = JSON.parse(seo);
      } catch {
        return res.status(400).json({ error: "Invalid SEO JSON" });
      }
    } else {
      parsedSeo = seo;
    }

    console.log(req.file?.path);
    // Create post
    const postDoc = await Post.create({
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
  } catch (err) {
    res.status(400).json({
      error: "Invalid data",
      details: err instanceof Error ? err.message : err,
    });
  }
};

/**
 * PUT /api/posts/:id
 * Protected - author or admin. If author, must own the post.
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ error: "Post not found" });

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (
      req.user.role !== "admin" &&
      existing.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, slug, content, category, tags, seo, published } = req.body;

    if (title) existing.title = title;
    if (slug) existing.slug = slug;
    if (content) existing.content = content;
    if (category) existing.category = category;

    // Tags
    if (tags) {
      if (typeof tags === "string") {
        try {
          existing.tags = JSON.parse(tags);
        } catch {
          return res.status(400).json({ error: "Invalid tags JSON" });
        }
      } else existing.tags = tags;
    }

    // SEO
    if (seo) {
      if (typeof seo === "string") {
        try {
          existing.seo = JSON.parse(seo);
        } catch {
          return res.status(400).json({ error: "Invalid SEO JSON" });
        }
      } else existing.seo = seo;
    }

    if (published !== undefined)
      existing.published = published === "true" || published === true;

    // if (req.file?.path) existing.featuredImage = req.file.path;

    await existing.save();

    // Populate using a new query
    const populated = await Post.findById(existing._id)
      .populate("author", "name email")
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .exec();

    res.json(populated);
  } catch (err) {
    res.status(400).json({
      error: "Invalid update request",
      details: err instanceof Error ? err.message : err,
    });
  }
};


/**
 * DELETE /api/posts/:id
 * Protected - admin or author (owner)
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "Invalid ID" });

  try {
    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ error: "Post not found" });

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (
      req.user.role !== "admin" &&
      existing.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
