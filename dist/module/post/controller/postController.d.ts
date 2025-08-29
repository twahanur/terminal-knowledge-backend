import { Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth";
/**
 * GET /api/posts
 */
export declare const getAllPosts: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/posts/:id
 */
export declare const getPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/posts
 * Protected - author or admin
 * multipart/form-data with optional image field named "image"
 */
export declare const addPost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PUT /api/posts/:id
 * Protected - author or admin. If author, must own the post.
 */
export declare const updatePost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE /api/posts/:id
 * Protected - admin or author (owner)
 */
export declare const deletePost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=postController.d.ts.map