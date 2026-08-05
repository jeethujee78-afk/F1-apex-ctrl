import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
export const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || "apex-ctrl-telemetry";

let dynamoDbClient: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;

function getDynamoDocClient(): DynamoDBDocumentClient {
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

// Memory fallback cache for ultra-fast local retrieval and connection resilience
interface LocalCacheItem {
  data: any;
  timestamp: number;
  ttlSeconds: number;
}
const localMemoryCache = new Map<string, LocalCacheItem>();

export class CacheRepository {
  /**
   * Sanitizes cacheKey into a safe primary key (sessionkey) string for DynamoDB
   */
  private static sanitizeKey(cacheKey: string): string {
    return cacheKey.replace(/[^a-zA-Z0-9_:-]/g, "_").substring(0, 200);
  }

  /**
   * Checks DynamoDB (and local fallback) for cached OpenF1 data
   */
  static async get(cacheKey: string): Promise<any | null> {
    const sessionKey = this.sanitizeKey(cacheKey);
    const now = Math.floor(Date.now() / 1000);

    // 1. First check high-speed in-memory cache
    const memItem = localMemoryCache.get(sessionKey);
    if (memItem) {
      const isExpired = (Date.now() - memItem.timestamp) / 1000 > memItem.ttlSeconds;
      if (!isExpired) {
        return memItem.data;
      }
    }

    // 2. Query DynamoDB
    try {
      const client = getDynamoDocClient();
      const command = new GetCommand({
        TableName: DYNAMODB_TABLE,
        Key: { sessionkey: sessionKey },
      });

      const response = await client.send(command);
      if (response.Item) {
        const item = response.Item;
        // Check DynamoDB TTL expiration
        if (item.ttl && Number(item.ttl) < now) {
          console.log(`[CacheRepository DynamoDB] Expired cache entry for key ${sessionKey}`);
          return null;
        }

        const data = typeof item.data === "string" ? JSON.parse(item.data) : item.data;
        // Populate local memory cache for sub-ms subsequent access
        localMemoryCache.set(sessionKey, {
          data,
          timestamp: Date.now(),
          ttlSeconds: item.ttl ? Number(item.ttl) - now : 43200,
        });

        console.log(`[CacheRepository DynamoDB] Cache HIT for key ${sessionKey}`);
        return data;
      }
    } catch (error: any) {
      console.warn(`[CacheRepository DynamoDB Warning] Failed to fetch cache for key ${sessionKey}:`, error.message);
    }

    // 3. Fallback to stale memory item if network failed or item expired
    if (memItem) {
      console.log(`[CacheRepository Fallback] Serving stale memory cache for ${sessionKey}`);
      return memItem.data;
    }

    return null;
  }

  /**
   * Saves OpenF1 response to DynamoDB with automatic TTL expiration
   */
  static async set(cacheKey: string, data: any, ttlSeconds: number = 43200): Promise<void> {
    const sessionKey = this.sanitizeKey(cacheKey);
    const nowSecs = Math.floor(Date.now() / 1000);
    const ttlTimestamp = nowSecs + ttlSeconds;

    // Save to memory cache immediately
    localMemoryCache.set(sessionKey, {
      data,
      timestamp: Date.now(),
      ttlSeconds,
    });

    // Persist in Amazon DynamoDB
    try {
      const client = getDynamoDocClient();
      const stringifiedData = JSON.stringify(data);

      const command = new PutCommand({
        TableName: DYNAMODB_TABLE,
        Item: {
          sessionkey: sessionKey,
          cacheKey: cacheKey,
          data: stringifiedData,
          updatedAt: Date.now(),
          ttl: ttlTimestamp, // DynamoDB native TTL attribute
        },
      });

      await client.send(command);
      console.log(`[CacheRepository DynamoDB] Successfully cached key ${sessionKey} (TTL: ${ttlSeconds}s)`);
    } catch (error: any) {
      console.warn(`[CacheRepository DynamoDB Warning] Failed to write cache for key ${sessionKey}:`, error.message);
    }
  }

  /**
   * Clears or invalidates a cache key
   */
  static async invalidate(cacheKey: string): Promise<void> {
    const sessionKey = this.sanitizeKey(cacheKey);
    localMemoryCache.delete(sessionKey);
  }
}
