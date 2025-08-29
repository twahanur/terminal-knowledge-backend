import express from "express";
import {
  createCategory,
  getCategories,
  getPostByCategories,
} from "./categoryController";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getPostByCategories);

export default router;
