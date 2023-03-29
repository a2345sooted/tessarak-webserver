// import express, { Request, Response } from 'express';
// import { handle } from '../utils/express';
// import { authUser, refreshUserToken, sendSMSCode, verifySMSCode } from '../services/auth0';
// import { updateContextWithSub } from '../middleware/request-context';
// import { BadRequestError } from '../errors';
//
//
// export function authController(): express.Router {
//     const router = express.Router();
//     router.post('/send', handle(sendCodeToPhone));
//     router.post('/verify', handle(verifyCodeForPhone));
//     router.post('/refresh', authUser(), updateContextWithSub(), handle(refreshTokenForPhone));
//
//     return router;
// }
//
// export type SendCodeRequest = {
//     phone: string;
// }
// export async function sendCodeToPhone(req: Request, res: Response) {
//     const phone = (req.body as SendCodeRequest).phone;
//     if (!phone) {
//         throw new BadRequestError('missing_number');
//     }
//     return sendSMSCode(req.ctx.log, phone);
// }
//
// export type VerifyCodeRequest = {
//     phone: string;
//     code: string;
// }
// export type AuthSuccessResponse = {
//     access_token: string;
//     refresh_token: string;
//     id_token: string;
//     scope: string;
//     expires_in: number;
//     token_type: string;
// }
// export async function verifyCodeForPhone(req: Request, res: Response): Promise<AuthSuccessResponse> {
//     const body = req.body as VerifyCodeRequest;
//     const phone = body.phone;
//     if (!phone) {
//         throw new BadRequestError('missing_number');
//     }
//     const code = body.code;
//     if (!code) {
//         throw new BadRequestError('missing_code');
//     }
//     return verifySMSCode(req.ctx.log, phone, code);
// }
//
// export type RefreshTokenRequest = {
//     refreshToken: string;
// }
//
// export async function refreshTokenForPhone(req: Request, res: Response): Promise<AuthSuccessResponse> {
//     const token = (req.body as RefreshTokenRequest).refreshToken;
//     if (!token) {
//         throw new BadRequestError('missing_refresh_token');
//     }
//     return refreshUserToken(req.ctx.log, token);
// }
