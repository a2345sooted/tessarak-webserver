import { getNumberOrFail, getStringOrFail } from './utils/env-helpers';
import cors, { CorsOptions } from 'cors';


export interface Auth0Config {
    domain: string;
    clientId: string;
    clientSecret: string;
    token: string;
    audience: string;
    authClientId: string;
    authClientSecret: string;
}

export interface OpenAIConfig {
    apiKey: string;
    organization: string;
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    apkBucketName: string;
    userMessageTable: string;
}

export interface ServerConfig {
    envName: string;
    logLevel: string;
    port: number;
}

export function getAuth0Config(): Auth0Config {
    const domain = getStringOrFail('AUTH0_MGMT_API_DOMAIN');
    const clientId = getStringOrFail('AUTH0_MGMT_API_CLIENT_ID');
    const clientSecret = getStringOrFail('AUTH0_MGMT_API_CLIENT_SECRET');
    const token = getStringOrFail('AUTH0_MGMT_API_TOKEN');
    const authClientId = getStringOrFail('AUTH0_AUTH_API_CLIENT_ID');
    const authClientSecret = getStringOrFail('AUTH0_AUTH_API_CLIENT_SECRET');
    const audience = getStringOrFail('AUTH0_AUTH_API_AUDIENCE');
    return {
        domain,
        clientId,
        clientSecret,
        token,
        authClientId,
        authClientSecret,
        audience,
    };
}

export function getOpenAIConfig(): OpenAIConfig {
    const apiKey = getStringOrFail('OPENAI_API_KEY');
    const organization = getStringOrFail('OPENAI_ORGANIZATION_ID');
    return {
        apiKey, organization,
    };
}

export function getAWSConfig(): AWSConfig {
    const region = getStringOrFail('AWS_REGION');
    const accessKeyId = getStringOrFail('AWS_ACCESS_KEY_ID');
    const secretAccessKey = getStringOrFail('AWS_SECRET_ACCESS_KEY');
    const apkBucketName = getStringOrFail('AWS_APK_BUCKET_NAME');
    const userMessageTable = getStringOrFail('AWS_USER_MESSAGE_TABLE_NAME');
    return {
        region, accessKeyId, secretAccessKey, apkBucketName, userMessageTable,
    };
}

export const corsOptions: CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
};

export function getCorsConfig() {
    return cors(corsOptions);
}

export function getServerConfig(): ServerConfig {
    const envName = getStringOrFail('ENV_NAME');
    const logLevel = getStringOrFail('LOG_LEVEL');
    const port = getNumberOrFail('SERVER_PORT');
    return {
        envName, logLevel, port,
    };
}
