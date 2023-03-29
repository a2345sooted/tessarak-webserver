import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import { getAndroidApkDownloadUrl } from '../services/s3';
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript'

export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    router.post('/message', handle(testSignal));
    router.get('/', handle(getRoot));

    return router;
}

export async function getApk(req: Request, res: Response): Promise<string> {
    return getAndroidApkDownloadUrl(req.ctx.log);
}

export async function getRoot(req: Request, res: Response): Promise<string> {
    return 'Hello from Tessarak :)';
}

export type PostMessageBody = {
    text: string;
}

// working off the readme for this library: https://github.com/privacyresearchgroup/libsignal-protocol-typescript
export async function testSignal(req: Request, res: Response): Promise<string> {
    const text = (req.body as PostMessageBody).text;
    return `here's what i received: ${text}`;
}
