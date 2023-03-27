import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';


export type HandleFn<T> = (req: Request, res: Response) => Promise<T>

export type TessaError = {
    log: Logger;
    cause: any;
}

export function handle<T = any>(fn: HandleFn<T>) {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await fn(req, res);

            if (!res.statusCode) {
                res.statusCode = 200;
            }

            if(!_.isUndefined(result)) {

                if(_.isObject(result)) {
                    res.json(result);
                }
                else {
                    res.send(result);
                }
            }

            res.end();
            next();
        }

        catch (error: any) {
            next({
                log: req.ctx.log,
                cause: error
            });
        }
    }
}
