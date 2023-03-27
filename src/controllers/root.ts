import express, { Request, Response } from 'express';
import { handle } from '../utils/express';


export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    router.get('/', handle(getRoot));

    return router;
}

export async function getApk(req: Request, res: Response): Promise<string> {
    return 'Hello from Tessarak :)';
}

export async function getRoot(req: Request, res: Response): Promise<string> {
    return 'Hello from Tessarak :)';
}
