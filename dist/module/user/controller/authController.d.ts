import { Request, Response } from "express";
/**
 * POST /api/auth/register
 * body: { name, email, password, role? }
 */
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/auth/login
 * body: { email, password }
 */
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map