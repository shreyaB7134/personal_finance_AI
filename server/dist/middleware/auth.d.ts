import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateToken: (userId: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
//# sourceMappingURL=auth.d.ts.map