import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import { getAndroidApkDownloadUrl } from '../services/s3';
import axios from 'axios';
import { APTag, getProfileComponents, TkContent, TkContentResponse, TkTag } from '../services/content';
import { ShipType } from '../entities/ship-type';
import { getDB } from '../db';
import { _ships, Ship } from '../entities/ship.entity';
import { _shipTagTrends, ShipTagTrend } from '../entities/ship-tag-trend.entity';
import { flatten, sum } from 'lodash';
import { DIMENSIONS } from '../mock-data';

export function rootController(): express.Router {
    const router = express.Router();
    router.get('/v1/apk', handle(getApk));
    // router.post('/message', handle(testSignal));
    router.get('/content', handle(getContent));
    router.get('/trends', handle(getTrends));
    router.get('/dimensions', handle(getDimensions));
    router.get('/dimension/:name', handle(getDimensionContent));
    // router.get('/crawl', handle(getCrawl));
    // router.get('/crawl2', handle(getCrawl2));
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

export async function getDimensionContent(req: Request, res: Response): Promise<any> {
    const name = req.params.name;
    const sourceTags = DIMENSIONS.tags.filter(d => d.name === name)[0]?.source_tags;
    const tagResults = await _shipTagTrends().createQueryBuilder('tag')
        .select('url')
        .where('LOWER(tag.name) in (:...names)', {names: sourceTags})
        .andWhere('tag.score > :threshold', {threshold: 500})
        .orderBy('tag.score', 'DESC')
        .limit(1)
        .execute();
    const urls = tagResults.map((u: any) => u.url);
    const requests = urls.map((url: string) => {
        const s1 = url.split('//');
        const s2 = s1[1].split('/');
        const u = `https://${s2[0]}/api/v1/timelines/tag/${s2[2]}`;
        return axios.get(u);
    });
    const responses = await Promise.all(requests);
    console.log('about to response');
    return flatten(responses.map(r => r.data)).filter(c => !c.account.bot);
}


export async function getDimensions(req: Request, res: Response): Promise<string[]> {
    return DIMENSIONS.tags.map(d => d.name);
}


export async function getTrends(req: Request, res: Response): Promise<any> {
    req.ctx.log.info('get trends');
    return (await _shipTagTrends().createQueryBuilder()
        .select('LOWER(name) as name')
        .groupBy('LOWER(name)')
        .having('SUM(score) > 1500')
        .orderBy('SUM(score)', 'DESC')
        .limit(20)
        .execute()).map((tag: any) => tag.name);
}

export async function getCrawl(req: Request, res: Response): Promise<any> {
    req.ctx.log.info('get crawl');

    async function crawl() {
        const response = await axios.get('https://instances.social/list.json?q%5Blanguages%5D%5B%5D=en&q%5Bmin_users%5D=&q%5Bmax_users%5D=&q%5Bsearch%5D=&strict=false');
        const instances = response.data.instances;
        const inserts: any[] = [];
        for (const instance of instances) {
            let ship = _ships().findOne({where: {id: instance._id}});
            if (!ship) {
                const ship = new Ship();
                ship.id = instance._id;
                ship.domain = instance.name;
                ship.type = instance.mastodon === true ? ShipType.MASTODON : ShipType.UNKNOWN;
                inserts.push(_ships().save(ship));
            }
        }
        await Promise.all(inserts);
    }

    crawl();
    return 'crawling';
}


export async function getCrawl2(req: Request, res: Response): Promise<any> {
    req.ctx.log.info('get crawl2');

    async function crawl2() {
        const mstShips = await _ships().createQueryBuilder('ship')
            .where('ship.type = :type', {type: ShipType.MASTODON})
            // .limit(5)
            .getMany();
        // req.ctx.log.info(`num ships = ${mstShips.length}`);
        // const stats = await _shipStats().createQueryBuilder('stats')
        //     .where(`stats.shipId in (${mstShips.map(s => s.id).join(',')}) and `)
        //     .getMany();
        for (const ship of mstShips) {
            // const index: number = mstShips.indexOf(ship);
            try {
                const response = await axios.get(`https://${ship.domain}/api/v1/trends/tags`);
                const tags = response.data;
                for (const tag of tags) {
                    let trend = await _shipTagTrends().findOne({where: {shipId: ship.id, name: tag.name}});
                    if (!trend) {
                        trend = new ShipTagTrend();
                        trend.shipId = ship.id;
                        trend.name = tag.name;
                        trend.url = tag.url;
                    }
                    const accounts = tag.history.map((h: any) => parseInt(h.accounts));
                    trend.score = sum(accounts);
                    await _shipTagTrends().save(trend);
                }
            } catch (error: any) {
                // continue;
            }
        }
    }
    crawl2();
    return 'crawling 2';
}







// working off the readme for this library: https://github.com/privacyresearchgroup/libsignal-protocol-typescript
// export async function testSignal(req: Request, res: Response): Promise<string> {
//     const text = (req.body as PostMessageBody).text;
//     return `here's what i received: ${text}`;
// }
