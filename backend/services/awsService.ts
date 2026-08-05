import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CacheRepository } from "./CacheRepository";
import { StorageRepository } from "./StorageRepository";

export { CacheRepository, StorageRepository };

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
export const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || "apex-ctrl-telemetry";
export const S3_BUCKET = process.env.S3_BUCKET || "apex-ctrl-assets-jeethu";

let dynamoDbClient: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;
let s3Client: S3Client | null = null;

export function getDynamoDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    dynamoDbClient = new DynamoDBClient({ region: AWS_REGION });
    docClient = DynamoDBDocumentClient.from(dynamoDbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
  }
  return docClient;
}

export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({ region: AWS_REGION });
  }
  return s3Client;
}

export interface SessionCache {
  sessionkey: string;
  exactResults?: any;
  exactResultsTimestamp?: number;
  weather?: any;
  weatherTimestamp?: number;
  drivers?: any;
  driversTimestamp?: number;
}

export async function getSessionCache(sessionKey: string): Promise<SessionCache | null> {
  try {
    return await CacheRepository.get(`session:${sessionKey}`);
  } catch (error: any) {
    console.error(`[AWS DynamoDB] Failed to read cache for session ${sessionKey}:`, error.message);
    return null;
  }
}

export async function saveSessionCache(sessionKey: string, updates: Partial<SessionCache>): Promise<void> {
  try {
    const existing = await getSessionCache(sessionKey) || { sessionkey: String(sessionKey) };
    const merged = {
      ...existing,
      ...updates,
      sessionkey: String(sessionKey),
    };
    await CacheRepository.set(`session:${sessionKey}`, merged, 86400);
    console.log(`[AWS DynamoDB] Cache updated successfully for session ${sessionKey}`);
  } catch (error: any) {
    console.error(`[AWS DynamoDB] Failed to write cache for session ${sessionKey}:`, error.message);
  }
}

export async function uploadReportToS3(key: string, content: string, contentType: string = "text/markdown"): Promise<string> {
  try {
    const url = await StorageRepository.saveRawPayload("reports", key, content);
    if (url) return url;
    
    // Direct fallback upload
    const s3 = getS3Client();
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: content,
      ContentType: contentType,
    });
    await s3.send(command);
    console.log(`[AWS S3] Report uploaded successfully to ${S3_BUCKET}/${key}`);
    return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error(`[AWS S3] Failed to upload report to ${key}:`, error.message);
    throw error;
  }
}

