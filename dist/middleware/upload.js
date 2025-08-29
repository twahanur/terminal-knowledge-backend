"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        return {
            public_id: `blog_${Date.now()}`,
            resource_type: "image",
            folder: "blog-images",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        };
    },
});
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=upload.js.map