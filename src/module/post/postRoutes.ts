import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  getAllPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
} from "./postController";
import { upload } from "../../middleware/upload";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected: create, update, delete
// router.post("/", authMiddleware, upload.single("image"), addPost);
router.post("/", upload.single("image"), addPost);
router.put("/:id",  updatePost);
router.delete("/:id", deletePost);

export default router;
