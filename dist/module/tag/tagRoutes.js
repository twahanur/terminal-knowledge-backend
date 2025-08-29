"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("./tagController");
const router = express_1.default.Router();
router.post("/", tagController_1.createTag);
router.get("/", tagController_1.getTags);
exports.default = router;
//# sourceMappingURL=tagRoutes.js.map