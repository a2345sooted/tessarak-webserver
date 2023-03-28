import * as dynamo from '@aws-sdk/client-dynamodb';
import { getAWSConfig } from '../config';

const awsConfig = getAWSConfig();

const dynamoClient = new dynamo.DynamoDBClient({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
} as dynamo.DynamoDBClientConfig);


export async function getMessages(): Promise<any> {

}

export async function updateUserMessageMeta(): Promise<any> {

}
