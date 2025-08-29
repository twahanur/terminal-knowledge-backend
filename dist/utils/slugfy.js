"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
const generateSlug = (text) => {
    return text
        .toString()
        .normalize("NFKD")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .slice(0, 200);
};
exports.generateSlug = generateSlug;
//# sourceMappingURL=slugfy.js.map