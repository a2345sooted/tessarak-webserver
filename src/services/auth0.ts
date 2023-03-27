import { getAuth0Config } from '../config';
import { auth } from "express-oauth2-jwt-bearer";
import { AuthenticationClient, ManagementClient, ManagementClientOptions, UpdateUserData, User } from 'auth0';
import axios, { AxiosError } from 'axios';
import { Logger } from 'pino';
import { AuthSuccessResponse } from '../controllers/auth';
import { BadRequestError } from '../errors';

const auth0Config = getAuth0Config();
const creds = {
    domain: auth0Config.domain,
    clientId: auth0Config.clientId,
    clientSecret: auth0Config.clientSecret
};
const mClient = new ManagementClient(creds as ManagementClientOptions);
const aClient = new AuthenticationClient({
    domain: auth0Config.domain,
    clientId: auth0Config.authClientId,
    clientSecret: auth0Config.authClientSecret
})

export async function initAuth0() {

}

export function authUser() {
    return auth({
        issuerBaseURL: `https://${auth0Config.domain}`,
        audience: auth0Config.audience,
    });
}

export async function getUser(sub: string): Promise<User> {
    return mClient.getUser({id: sub});
}

export async function deleteUser(sub: string): Promise<any> {
    return mClient.deleteUser({id: sub});
}

export async function sendSMSCode(log: Logger, phoneNumber: string) {
    try {
        const response = await axios.post(`https://${auth0Config.domain}/passwordless/start`, {
            client_id: auth0Config.authClientId,
            connection: 'sms',
            send: 'code',
            phone_number: phoneNumber,
        });
        return response.data;
    } catch (error: any) {
        error = error as AxiosError;
        if (!error.response) {
            throw new Error('invalid error object from axios, response field is missing');
        }
        if (error.response.status === 400) {
            throw new BadRequestError('invalid_number');
        } else {
            throw error;
        }
    }
}

export async function verifySMSCode(log: Logger, phoneNumber: string, code: string): Promise<AuthSuccessResponse> {
    try {
        const response = await axios.post(`https://${auth0Config.domain}/oauth/token`, {
            client_id: auth0Config.authClientId,
            otp: code,
            realm: 'sms',
            username: phoneNumber,
            audience: auth0Config.audience,
            grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
            scope: 'openid profile offline_access',
        });
        return response.data;

    } catch (error: any) {
        throw {
            status: error.status,
            message: error.message,
        }
    }
}

export async function refreshUserToken(log: Logger, token: string): Promise<AuthSuccessResponse> {
    try {
        const response = await axios.post(`https://${auth0Config.domain}/oauth/token`, {
            client_id: auth0Config.authClientId,
            client_secret: auth0Config.authClientSecret,
            grant_type: 'refresh_token',
            refresh_token: token,
        });
        return response.data;

    } catch (error: any) {
        throw {
            status: error.status,
            message: error.message,
        }
    }
}

export async function getUserInfoFromToken(token: string): Promise<any> {
    return aClient.users?.getInfo(token);
}
