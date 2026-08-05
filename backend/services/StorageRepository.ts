import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
export const S3_BUCKET = process.env.S3_BUCKET || "apex-ctrl-assets-jeethu";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({ region: AWS_REGION });
  }
  return s3Client;
}

export class StorageRepository {
  /**
   * Stores raw OpenF1 payload as JSON in Amazon S3
   * Path format: raw/{endpoint}/{key}.json
   */
  static async saveRawPayload(endpoint: string, key: string, payload: any): Promise<string | null> {
    const sanitizedEndpoint = endpoint.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    const s3Path = `raw/${sanitizedEndpoint}/${sanitizedKey}_${Date.now()}.json`;

    try {
      const s3 = getS3Client();
      const content = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
      
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Path,
        Body: content,
        ContentType: "application/json",
      });

      await s3.send(command);
      console.log(`[StorageRepository] Raw payload saved to S3: s3://${S3_BUCKET}/${s3Path}`);
      return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${s3Path}`;
    } catch (error: any) {
      console.warn(`[StorageRepository S3 Warning] Could not store payload in S3 (${s3Path}):`, error.message);
      return null;
    }
  }

  /**
   * Retrieves raw OpenF1 payload from Amazon S3 if needed
   */
  static async getRawPayload(s3Key: string): Promise<any | null> {
    try {
      const s3 = getS3Client();
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      const response = await s3.send(command);
      if (!response.Body) return null;
      
      const bodyContents = await response.Body.transformToString();
      return JSON.parse(bodyContents);
    } catch (error: any) {
      console.warn(`[StorageRepository S3 Warning] Failed to read ${s3Key} from S3:`, error.message);
      return null;
    }
  }
}
