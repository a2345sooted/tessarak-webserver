// import * as s3 from '@aws-sdk/client-s3';
// import { getAWSConfig } from '../config';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { Logger } from 'pino';
//
// const awsConfig = getAWSConfig();
// const s3Client = new s3.S3Client({ region: awsConfig.region });
//
// export async function initS3(): Promise<boolean> {
//     return true;
// }
//
// export async function getAndroidApkDownloadUrl(log: Logger): Promise<string> {
//     const command = new s3.GetObjectCommand({Bucket: awsConfig.apkBucketName, Key: awsConfig.androidApkKey});
//     return getSignedUrl(s3Client as any, command as any, { expiresIn: 60 });
// }
