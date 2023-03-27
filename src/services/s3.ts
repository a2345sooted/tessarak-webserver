import * as s3 from '@aws-sdk/client-s3';
import { getAWSConfig } from '../config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const awsConfig = getAWSConfig();
const s3Client = new s3.S3Client({ region: awsConfig.region });

export async function initS3(): Promise<boolean> {
    return true;
}

export async function getAndroidApkDownloadUrl(): Promise<string> {
    // const command = new s3.GetObjectCommand({Bucket: awsConfig.apkBucketName, Key: ''});
    // return getSignedUrl(s3Client as any, command as any, { expiresIn: 15 * 60 });
    // return list;
    return 'fake_url';
}
