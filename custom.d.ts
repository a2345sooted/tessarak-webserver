import { RequestContext } from './src/middleware/request-context';

declare module 'express-serve-static-core' {

    interface Request {
        ctx: RequestContext;
    }
}

declare module 'libsignal';
