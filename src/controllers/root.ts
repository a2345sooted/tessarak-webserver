import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import { getAndroidApkDownloadUrl } from '../services/s3';


export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    router.get('/', handle(getRoot));

    return router;
}

export async function getApk(req: Request, res: Response): Promise<string> {
    return getAndroidApkDownloadUrl(req.ctx.log);
}

export async function getRoot(req: Request, res: Response): Promise<string> {
    return 'Hello from Tessarak :)';
}
