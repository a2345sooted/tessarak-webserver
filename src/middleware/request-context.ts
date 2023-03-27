import { Logger } from 'pino';
import { NextFunction, Request, Response } from 'express';
import { TessarakWebserver } from '../server';
import { createUUID, UUID } from '../utils/uuid';
import { TessaError } from '../utils/express';

export interface RequestContext {
    requestId: UUID;
    log: Logger;
    sub: string;
}

export function setRequestContext(server: TessarakWebserver) {
    return async function (req: Request, res: Response, next: NextFunction) {

        const requestId = createUUID();
        const log = server.log.child({ reqID: requestId });

        req.ctx = {
            requestId,
            log,
            sub: req.auth?.payload.sub as unknown as string,
        };

        next();
    }
}

export function updateContextWithSub() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const sub = req.auth?.payload.sub as unknown as string;
        if (!sub) {
            const error: TessaError = {
                log: req.ctx.log,
                cause: 'missing user id',
            }
            next(error);
            return;
        }
        req.ctx.sub = sub;
        next();
    }
}
