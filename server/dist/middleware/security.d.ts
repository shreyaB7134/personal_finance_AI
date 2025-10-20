import { Request, Response, NextFunction } from 'express';
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const corsOptions: {
    origin: (origin: any, callback: any) => any;
    credentials: boolean;
};
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map