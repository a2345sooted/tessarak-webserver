import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import { getAndroidApkDownloadUrl } from '../services/s3';
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript'
import axios from 'axios';

export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    // router.post('/message', handle(testSignal));
    router.get('/content', handle(getContent));
    router.get('/', handle(getRoot));

    return router;
}

export async function getApk(req: Request, res: Response): Promise<string> {
    return getAndroidApkDownloadUrl(req.ctx.log);
}

export async function getRoot(req: Request, res: Response): Promise<any> {
    return {message: 'hi'};
}

export type PostMessageBody = {
    text: string;
}

export async function getContent(req: Request, res: Response): Promise<any[]> {
    const profileResponse = await axios.get('https://mastodon.social/users/willwood.json');
    const profile = profileResponse.data;
    const contentResponse = await axios.get('https://mastodon.social/users/willwood/outbox.json?min_id=0&page=true');
    const content = contentResponse.data;
    const updatedItems = content.orderedItems.map((item: any) => ({...item, name: profile.name}));
    return updatedItems;
}







// working off the readme for this library: https://github.com/privacyresearchgroup/libsignal-protocol-typescript
// export async function testSignal(req: Request, res: Response): Promise<string> {
//     const text = (req.body as PostMessageBody).text;
//     return `here's what i received: ${text}`;
// }
