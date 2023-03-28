import express, { Request, Response } from 'express';
import { handle } from '../utils/express';
import * as auth0 from '../services/auth0';


type TessarakUser = {
    sub: string;
    phone: string;
};


export function userController(): express.Router {
    const router = express.Router();
    router.get('/', handle(getUser));
    router.delete('/', handle(deleteUser));
    return router;
}

export async function getUser(req: Request, res: Response): Promise<TessarakUser> {
    const auth0User = await auth0.getUser(req.ctx.sub);
    return {
        sub: req.ctx.sub,
        phone: auth0User.phone_number!,
    };
}
export async function deleteUser(req: Request, res: Response): Promise<void> {
    await auth0.deleteUser(req.ctx.sub);
}
