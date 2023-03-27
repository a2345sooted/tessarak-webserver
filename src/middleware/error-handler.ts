import { NextFunction, Request, Response } from 'express';
import { InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { BadRequestError, NotFoundError } from '../errors';
import { TessaError } from '../utils/express';


export const errorHandler = () => {
    return (error: any, request: Request, response: Response, next: NextFunction) => {

        // these errors are thrown by auth0 middleware before the tessarak custom error handler
        // sets up a TessaError object
        if (error instanceof InvalidTokenError || error instanceof UnauthorizedError) {
            response.status(404).end();
            return;
        }

        // now we can assume the error is of type TessaError
        error = error as TessaError;

        if (error.cause instanceof NotFoundError) {
            response.status(404).end();
            return;
        }

        if (error.cause instanceof BadRequestError) {
            response.status(400).send(error.cause.message);
            return;
        }

        error.log.info({
            error: error.cause.message,
            stack: error.cause.stack
        }, 'request response with error');

        response.status(500).end();
    };
}
