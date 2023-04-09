import express, { Request, Response } from "express";
import { handle } from "../../../utils/express";
import { getActivityHref } from "../../../services/activitypub/webfinger";
import { getActor, getActorOutbox, getOutboxItems } from "../../../services/activitypub/activity";
import { makeUserId } from "../../../models/users/user-id";

export function postsController() {
    const router = express.Router();
    router.get('/:userId/posts', handle(getPosts));
    return router;
}

async function getPosts(req: Request, res: Response) {
    const userId = req.params.userId;
    const userIdModel = makeUserId(userId);
    const actorHref = await getActivityHref(userIdModel.domain, userIdModel.username);
    if (!actorHref) return res.status(404).send("User not found.");

    const actor = await getActor(actorHref);
    if (!actor) return res.status(404).send("User not found.");
    const outbox = (await getActorOutbox(actorHref) as any);
    const firstHref = outbox.first;
    const lastHref = outbox.last;

    const firstPage = await getOutboxItems(firstHref);

    return {
        first: firstHref,
        last: lastHref,
        next: firstPage.next,
        prev: firstPage.prev,
        items: firstPage.orderedItems
    };
}