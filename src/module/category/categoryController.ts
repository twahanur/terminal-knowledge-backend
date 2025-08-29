import { Request, Response } from "express";
import Category, { ICategory } from "./CategoryModel";
import PostModel from "../post/PostModel";
import mongoose from "mongoose";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    console.log(name,slug)

    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ error: "Slug already exists" });

    const category: ICategory = new Category({ name, slug });
    const saved = await category.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};


export const getPostByCategories = async (req: Request, res: Response) => {
  const {id}= req.params
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    try {
    const posts = await PostModel.find({ category: id })
      .sort({ createdAt: -1 })
      .populate("author")
      .populate("category")
      .populate("tags")
      .exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
  }
