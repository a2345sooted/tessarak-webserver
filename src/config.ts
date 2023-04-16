import { getNumberOrFail, getStringOrFail } from './utils/env-helpers';
import cors, { CorsOptions } from 'cors';


export interface DbConfig {
    username: string;
    password: string;
    host: string;
    port: number;
    dbName: string;
}

export function getDbConfig(): DbConfig {
    const username = getStringOrFail('DB_USERNAME');
    const password = getStringOrFail('DB_PASSWORD');
    const host = getStringOrFail('DB_HOST');
    const port = getNumberOrFail('DB_PORT');
    const dbName = getStringOrFail('DB_NAME');
    return {
        username, port, password, host, dbName,
    };
}


export interface Auth0Config {
    domain: string;
    clientId: string;
    clientSecret: string;
    // tokenPart1: string;
    // tokenPart2: string;
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
    userTessaMessageTable: string;
    androidApkKey: string;
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
    // const tokenPart1 = getStringOrFail('AUTH0_MGMT_API_TOKEN_PART_1');
    // const tokenPart2 = getStringOrFail('AUTH0_MGMT_API_TOKEN_PART_2');
    const authClientId = getStringOrFail('AUTH0_AUTH_API_CLIENT_ID');
    const authClientSecret = getStringOrFail('AUTH0_AUTH_API_CLIENT_SECRET');
    const audience = getStringOrFail('AUTH0_AUTH_API_AUDIENCE');
    return {
        domain,
        clientId,
        clientSecret,
        // tokenPart1,
        // tokenPart2,
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
    const userTessaMessageTable = getStringOrFail('AWS_USER_TESSA_MESSAGE_TABLE_NAME');
    const androidApkKey = getStringOrFail('AWS_ANDROID_APK_KEY');
    return {
        region,
        accessKeyId,
        secretAccessKey,
        apkBucketName,
        userTessaMessageTable,
        androidApkKey,
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
    const port = getNumberOrFail('PORT');
    return {
        envName, logLevel, port,
    };
}
