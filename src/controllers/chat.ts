import { WebsocketRequestHandler } from 'express-ws';
import * as wsconnection from 'ws';
import { NextFunction, Request } from 'express';
import { Logger } from 'pino';
import { createUUID } from '../utils/uuid';
import { randomUUID } from 'crypto';
import { submitChatPrompt } from '../services/openai';
import { delayMillis } from '../utils/helpers';
import { getUserInfoFromToken } from '../services/auth0';

export type GptMessage = {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

export type ChatSocketConnection = wsconnection & { id?: string, alive?: boolean };
export type SocketContext = {
    id: string;
    log: Logger;
    sub: string;
    name: string;
    socket: ChatSocketConnection;
    recentMessages: GptMessage[];
}
export type ChatSocketClientMap = {[index: string]: SocketContext};

export type SocketPongHandler = () => void;
export type SocketCloseHandler = () => void;
export type SocketDataHandler = (data: wsconnection.Data) => void;

export async function authenticateClient(log: Logger, socket: ChatSocketConnection, req: Request): Promise<SocketContext> {
    const token = req.query.token as string | undefined;

    if (!token) {
        throw new Error('missing token');
    }

    const userInfo = await getUserInfoFromToken(token);

    // log.info({userInfo});

    if (!userInfo) {
        throw new Error('unable to get user info for token');
    }

    if (!userInfo.sub) {
        throw new Error('sub on user info is blank');
    }

    const socketId = createUUID();
    socket.id = socketId;
    socket.alive = true;

    const socketLog = log.child({ socketId });

    return {
      id: socketId,
      log: socketLog,
      socket,
      sub: userInfo.sub,
      name: userInfo.name,
      recentMessages: [],
    };
}

export function startPingPong(ctx: SocketContext): NodeJS.Timer {
    const pingDelay = 60000;

    const pingInterval = setInterval(() => {
        // ctx.log.info('sending socket ping');
        ctx.socket.ping();
    }, pingDelay);

    return pingInterval;
}

export function getSocketPongHandler(ctx: SocketContext): SocketPongHandler {
    return function() {
        // ctx.log.info('socket ponged');
        ctx.socket.alive = true;
    }
}

export function getSocketCloseHandler(ctx: SocketContext, connections: ChatSocketClientMap, clientPing: NodeJS.Timer): SocketCloseHandler {
    return function() {
        ctx.log.info('socket closed');
        delete connections[ctx.id];
        clearInterval(clientPing);
    }
}

export function getSocketMessageHandler(ctx: SocketContext): SocketDataHandler {
    return function(data) {
        const message = JSON.parse(data as string);
        if (message.type === 'user_message') {
            handleUserMessage(ctx, message)
                .then(() => {
                    // todo
                })
                .catch((error: any) => {
                    // todo
                });
        }
    }
}

const DEFAULT_GREETING = "Hi. I'm Tessa. I also go by Tessy and Tess :)  I'm an ai chatbot primed to help you understand what The Tessarak is all about. You can ask me whatever you want!... especially about Tessarak. I want to help you understand :)\n\nGo ahead, ask me a question...";

export function createChatSocket(log: Logger): WebsocketRequestHandler {
    const clients: ChatSocketClientMap = {};

    return async function(socket: ChatSocketConnection, req: Request, next: NextFunction) {
        let ctx: SocketContext;

        try {
            ctx = await authenticateClient(log, socket, req);
        } catch (error: any) {
            socket.terminate();
            next(error);
            return;
        }

        clients[ctx.id] = ctx;

        ctx.log.info('chat socket client connected');

        const pingInterval = startPingPong(ctx);

        socket.on('pong', getSocketPongHandler(ctx));
        socket.on('close', getSocketCloseHandler(ctx, clients, pingInterval));
        socket.on('message', getSocketMessageHandler(ctx));

        await delayMillis(600);
        ctx.socket.send(JSON.stringify({type: 'tessa_typing'}), function(error?: Error) {});
        await delayMillis(2000);
        ctx.socket.send(JSON.stringify({type: 'tessa_message', id: randomUUID(), text: DEFAULT_GREETING}), function(error?: Error) {});
        ctx.recentMessages.push({role: 'assistant', content: DEFAULT_GREETING});

        next();
    }
}


async function handleUserMessage(ctx: SocketContext, message: any) {
    await delayMillis(500);
    ctx.socket.send(JSON.stringify({type: 'tessa_typing'}), function(error?: Error) {});
    ctx.recentMessages.push({role: 'user', content: message.text});
    const gptResponse = await submitChatPrompt(ctx);
    // ctx.log.info({gptResponse});
    ctx.recentMessages.push({role: 'assistant', content: gptResponse});
    await delayMillis(500);
    ctx.socket.send(JSON.stringify({type: 'tessa_message', id: randomUUID(), text: gptResponse}), function(error?: Error) {});
}
