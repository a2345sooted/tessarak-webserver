import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import { getAndroidApkDownloadUrl } from '../services/s3';
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript'
import axios from 'axios';
import { APTag, getProfileComponents, TkContent, TkContentResponse, TkTag } from '../services/content';

export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    // router.post('/message', handle(testSignal));
    router.get('/content', handle(getContent));
    router.get('/crawl', handle(getCrawl));
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

function mapTags(apTags: APTag[] | null): TkTag[] {
    if (!apTags || apTags.length < 1) {
        return [];
    }
    return apTags.map(t => ({name: t.name, url: t.href}));
}

async function getUserFeed(domain: string, username: string): Promise<TkContent[]> {
    const profileResponse = await axios.get(`https://${domain}/users/${username}.json`);
    const profile = profileResponse.data;
    const contentResponse = await axios.get(`https://${domain}/users/${username}/outbox.json?min_id=0&page=true`);
    const content = contentResponse.data;
    return content.orderedItems.map((item: any) => {
        const {domain, username} = getProfileComponents(profile.id);
        return {
            id: item.id,
            type: item.object.type,
            actor: {
                id: profile.id,
                name: profile.name,
                profile: profile.url,
                avatar: profile.icon.url,
                username,
                domain,
                preferredUsername: profile.preferredUsername,
            },
            published: item.published,
            liked: false,
            bookmarked: false,
            sound: {url: 'some_url'},
            comments: {latest: [], more: 'some_url'},
            content: item.object.content,
            attachments: item.object.attachment,
            tags: mapTags(item.tag),
        };
    });
}

export async function getContent(req: Request, res: Response): Promise<TkContentResponse> {
    req.ctx.log.info('get content');
    const willwood = await getUserFeed('mastodon.social', 'willwood');
    const gargron = await getUserFeed('mastodon.social', 'Gargron');
    return {
        items: willwood.concat(gargron)
    };
}

export async function getCrawl(req: Request, res: Response): Promise<any> {
    req.ctx.log.info('get crawl');
}







// working off the readme for this library: https://github.com/privacyresearchgroup/libsignal-protocol-typescript
// export async function testSignal(req: Request, res: Response): Promise<string> {
//     const text = (req.body as PostMessageBody).text;
//     return `here's what i received: ${text}`;
// }
