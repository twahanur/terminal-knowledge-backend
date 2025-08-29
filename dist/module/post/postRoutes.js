"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("./postController");
const upload_1 = require("../../middleware/upload");
const router = (0, express_1.Router)();
router.get("/", postController_1.getAllPosts);
router.get("/:id", postController_1.getPostById);
// Protected: create, update, delete
// router.post("/", authMiddleware, upload.single("image"), addPost);
router.post("/", upload_1.upload.single("image"), postController_1.addPost);
router.put("/:id", postController_1.updatePost);
router.delete("/:id", postController_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map