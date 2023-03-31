import express, { Request, Response } from 'express';
import { handle } from '../utils/express';


export function e2eeMessageController(): express.Router {
    const router = express.Router();
    router.put('/keys', handle(putKeyBundle));
    router.get('/keys/:address', handle(getPreKeyBundle));
    router.post('/messages/:address', handle(postMessage));
    router.get('/messages', handle(getMessages));
    return router;
}

export interface PublicPreKey {
    keyId: number
    publicKey: string
}

export interface SignedPublicKey {
    keyId: number
    publicKey: string
    signature: string
}

export interface FullKeyBundle {
    registrationId: number
    identityKey: string
    signedPreKey: SignedPublicKey
    oneTimePreKeys: PublicPreKey[]
}

export async function putKeyBundle(req: Request, res: Response): Promise<void> {
    const body = req.body as FullKeyBundle;
}

export interface PublicPreKeyBundle {
    identityKey: string
    signedPreKey: SignedPublicKey
    preKey?: PublicPreKey
    registrationId: number
}

export async function getPreKeyBundle(req: Request, res: Response): Promise<SignedPublicKey | null> {
    const address = req.params.address;
    req.ctx.log.info('address = ' + address);
    return null;
}

export interface PostMessageRequest {
    text: string;   // base 64 encoded protobuf string
}

export async function postMessage(req: Request, res: Response): Promise<void> {
    const messageText = (req.body as PostMessageRequest).text;
}


export async function getMessages(req: Request, res: Response): Promise<string[]> {
    const address = req.params.address;
    req.ctx.log.info('address = ' + address);
    const after = req.query.after;
    req.ctx.log.info('after = ' + after);
    return [];
}
