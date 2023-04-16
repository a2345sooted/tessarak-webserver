import express, { Express } from 'express';
import expressWs from 'express-ws';
import pino, { Logger } from 'pino';
import http, { Server } from 'http';
import { createUUID, UUID } from './utils/uuid';
import compression from 'compression';
import bodyParser from 'body-parser';
import { setRequestContext, updateContextWithSub } from './middleware/request-context';
import { authUser, initAuth0 } from './services/auth0';
import { initOpenAI } from './services/openai';
import { errorHandler } from './middleware/error-handler';
import { getCorsConfig, ServerConfig } from './config';
import { rootController } from './controllers/root';
import { userController } from './controllers/users';
import { createChatSocket } from './controllers/chat';
import { authController } from './controllers/auth';
import { initS3 } from './services/s3';
import { e2eeMessageController } from './controllers/e2eeMessageController';
import { connectToDatabase } from './db';



export function createRootLogger(config: ServerConfig, serverId: UUID): Logger {
    const isLocalEnv = config.envName === 'local';

    let log = pino({
        level: config.logLevel,
        useLevelLabels: true,
    });

    if (!isLocalEnv) {
        log = log.child({ server_id: serverId });
    }

    return log;
}

export function createExpressApp(server: TessarakWebserver): Express {
    const cors = getCorsConfig();
    const app = express();
    app.use(cors);
    app.options("*", cors);
    app.use(compression());
    app.use(bodyParser.json());
    app.use(setRequestContext(server));
    app.use('/', rootController());
    app.use(errorHandler());
    // app.use('/e2e', e2eeMessageController());
    app.use('/v1/auth', authController());
    // app.use('/v1/e2ee', authUser(), updateContextWithSub(), e2eeMessageController());
    app.use('/v1/user', authUser(), updateContextWithSub(), userController());
    app.use(errorHandler());
    return app;
}

function initChatSocket(server: TessarakWebserver): expressWs.Instance {
    const app = server.express;
    if (!app) {
        throw new Error('must create express app before initializing web socket handler');
    }

    const httpServer = server.httpServer;
    if (!httpServer) {
        throw new Error('must create http server before initializing web socket handler');
    }

    const appWs = expressWs(app, httpServer);
    appWs.app.ws('/chatv1', createChatSocket(server.log));
    return appWs;
}


export class TessarakWebserver {
    private readonly _id: UUID;
    private readonly _config: ServerConfig;
    private readonly _log: Logger;
    private readonly _express: Express;
    private readonly _httpServer: Server;
    private readonly _chatSocket: expressWs.Instance;

    constructor(config: ServerConfig) {
        this._config = config;
        this._id = createUUID();
        this._log = createRootLogger(this._config, this._id);
        this._express = createExpressApp(this);
        this._httpServer = http.createServer(this.express);
        this._chatSocket = initChatSocket(this);
    }

    get id(): UUID {
        return this._id;
    }

    get config(): ServerConfig {
        return this._config;
    }

    get log(): Logger {
        return this._log;
    }

    get express(): Express {
        return this._express;
    }

    get httpServer(): Server {
        return this._httpServer;
    }

    get chatSocket(): expressWs.Instance {
        return this._chatSocket;
    }

    async init() {
        const results = await Promise.all([
            connectToDatabase(),
            initAuth0(),
            initOpenAI(),
            initS3(),
        ]);
        // todo handle results looking for errors
    }

    async start() {
        // todo should I leave this where it's forced to listen with ipv4???
        return new Promise<void>(resolve => {
            this._httpServer.listen(this._config.port, '0.0.0.0', () => {
                this.log.info({port: this._config.port}, 'Tessarak server listening...');
                resolve();
            });
        });
    }

    async stop() {
        return new Promise<void>(resolve => {
            this._httpServer.close(() => {
                this.log.info('Stopped Tessarak server...');
                resolve();
            });
        });
    }
}
