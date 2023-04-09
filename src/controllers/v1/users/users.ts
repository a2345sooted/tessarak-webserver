import express, { Request, Response } from "express";
import { handle } from "../../../utils/express";
import { getActivityHref } from "../../../services/activitypub/webfinger";
import { getActor } from "../../../services/activitypub/activity";
import { makeUserId } from "../../../models/users/user-id";

export function usersController(): express.Router {
    const router = express.Router();
    router.get('/:userId', handle(getUser));
    return router;
}

export async function getUser(req: Request, res: Response): Promise<any> {
  const userId = req.params.userId;

  const userIdModel = makeUserId(userId);

  if (!userIdModel) {
    return res.status(400).send("Invalid userId.");
  }

  const actorHref = await getActivityHref(userIdModel.domain, userIdModel.username);
  if (!actorHref) return res.status(404).send("User not found.");

  const actor = await getActor(actorHref);
  if (!actor) return res.status(404).send("User not found.");

  return {
    ...actor
  }
}

