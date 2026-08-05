import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { uploadReportToS3 } from "../services/awsService";

let cachedSecretKey: string | null = null;

async function getGeminiApiKey(): Promise<string | undefined> {
  if (cachedSecretKey) return cachedSecretKey;

  // 1. Try environment variable FIRST (allows local env fallback for testing)
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey !== "MY_GEMINI_API_KEY" && envKey.trim().length > 10) {
    cachedSecretKey = envKey.trim();
    return cachedSecretKey;
  }

  // 2. Try retrieving secret 'apex-ctrl/gemini' from AWS Secrets Manager
  try {
    const region = process.env.AWS_REGION || "ap-south-1";
    const client = new SecretsManagerClient({ region });
    const command = new GetSecretValueCommand({ SecretId: "apex-ctrl/gemini" });
    const response = await client.send(command);

    if (response.SecretString) {
      try {
        const parsed = JSON.parse(response.SecretString);
        const key = parsed.GEMINI_API_KEY || parsed.api_key || parsed.apiKey || response.SecretString;
        if (key && key !== "MY_GEMINI_API_KEY" && key.trim().length > 10) {
          cachedSecretKey = key.trim();
          console.log("[AWS Secrets Manager] Successfully loaded key from secret 'apex-ctrl/gemini'");
          return cachedSecretKey;
        }
      } catch {
        if (response.SecretString && response.SecretString !== "MY_GEMINI_API_KEY" && response.SecretString.trim().length > 10) {
          cachedSecretKey = response.SecretString.trim();
          console.log("[AWS Secrets Manager] Loaded raw string key from secret 'apex-ctrl/gemini'");
          return cachedSecretKey;
        }
      }
    }
  } catch (err: any) {
    console.warn("[AWS Secrets Manager] Secret 'apex-ctrl/gemini' lookup notice (falling back to env):", err.message);
  }

  return envKey;
}

async function generateGeminiResponse(prompt: string, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const systemPrompt = `You are the Lead Race Engineer and Chief AI Strategist for APEX CTRL, an elite Formula 1 Mission Control system.
Answer directly as a top-tier F1 race engineer.
Your analysis MUST be fresh, unique, contextual, and derived directly from the provided OpenF1 session data, driver telemetry, lap timings, tire data, and weather parameters.
Do NOT use predefined templates, simulated responses, or generic place-holders.
If specific telemetry data (such as weather or sector splits) is not available in the provided dataset, state clearly and explicitly why that data is unavailable for this session (e.g., "Live weather telemetry feed unavailable for this session") instead of fabricating race analysis.
Format your output professionally using clear Markdown with bold titles, data-driven bullet points, and actionable engineering insights.`;

  const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        }
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Model ${model}] Error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate content from Gemini API.");
}

export async function getStrategy(req: Request, res: Response) {
  const apiKey = await getGeminiApiKey();
  const { sessionData, sessionName, location, sessionKey, drivers, lapsData, weatherData, tyreData } = req.body;

  if (!apiKey) {
    const errorNotice = `### APEX AI STRATEGIST REPORT

**Status: Gemini API Key Not Configured**

Unable to synthesize fresh race analysis because neither the AWS Secrets Manager secret (\`apex-ctrl/gemini\`) nor the \`GEMINI_API_KEY\` environment variable is set.

Please set the \`apex-ctrl/gemini\` secret in AWS Secrets Manager or define \`GEMINI_API_KEY\` in your environment configuration to enable real-time Gemini AI race strategy generation.`;

    return res.json({
      strategySummary: errorNotice,
      aiStatus: "Offline Engine (Missing GEMINI_API_KEY / AWS Secret apex-ctrl/gemini)",
      predictions: [
        { title: "AI Status", value: "Key Unconfigured", trend: "danger" },
        { title: "Session", value: sessionName || "Race", trend: "warning" },
      ]
    });
  }

  try {
    const prompt = `
Provide an APEX AI Race Strategy & Pit Window Report based on the following OpenF1 session dataset:

SESSION DETAILS:
- Grand Prix / Session: ${sessionName || sessionData?.session_name || "Unknown Race"}
- Location: ${location || sessionData?.location || "Unknown Location"}
- Session Key: ${sessionKey || sessionData?.session_key || "N/A"}

ACTIVE DRIVERS TELEMETRY:
${drivers ? JSON.stringify(drivers, null, 2) : "Driver list unavailable for this query."}

RECENT LAP ANALYSIS:
${lapsData ? JSON.stringify((lapsData || []).slice(0, 20), null, 2) : "Live lap timings stream active based on current session order."}

TYRE DATA:
${tyreData ? JSON.stringify(tyreData, null, 2) : "Tire compound allocations and degradation telemetry."}

WEATHER CONDITIONS:
${weatherData ? JSON.stringify(weatherData, null, 2) : "Weather telemetry feed."}

Provide a complete, data-driven report formatted in Markdown covering:
1. Executive Summary & Track Situation
2. Driver Performance Comparison (pacing, top speeds, sector trends)
3. Tactical Pit Stop Strategy & Tyre Recommendations (Undercut / Overcut potential)
4. Risk Assessment & Safety Car Probability
5. Final Race Engineer Recommendations

If any specific data point is missing from the payload, explain why instead of inventing facts.
`;

    const reportText = await generateGeminiResponse(prompt, apiKey);
    const activeSessionKey = sessionKey || sessionData?.session_key || "unknown";
    const s3Key = `reports/${activeSessionKey}/strategy-${Date.now()}.md`;
    uploadReportToS3(s3Key, reportText).catch(err => console.error("[AWS S3] Upload failed:", err.message));

    return res.json({
      strategySummary: reportText,
      aiStatus: "APEX AI Neural Engine Active",
      predictions: [
        { title: "AI Strategy", value: "Generated Live by Gemini", trend: "success" },
        { title: "Telemetry Stream", value: "OpenF1 Synced", trend: "success" },
      ]
    });
  } catch (err: any) {
    console.error("[getStrategy Error]", err);
    const errMsg = `### APEX AI STRATEGIST REPORT

**Error Generating Live Analysis**: ${err.message || "Gemini API request failed"}

If OpenF1 session data or Gemini quota limits were encountered, please check API credentials or select a different active session.`;

    return res.json({
      strategySummary: errMsg,
      aiStatus: "API Request Error",
      predictions: [
        { title: "Status", value: "Error encountered", trend: "danger" }
      ]
    });
  }
}

export async function getAnalysis(req: Request, res: Response) {
  const apiKey = await getGeminiApiKey();
  const { sessionName, location, drivers, driverData, requestType, sessionKey, lapsData, weatherData, tyreData } = req.body;
  const activeSessionKey = sessionKey || "unknown";

  if (!apiKey) {
    const errorNotice = `### Live Telemetry Analysis [APEX AI Engine]

**Status: Gemini API Key Not Configured**

Unable to generate fresh AI telemetry analysis because neither the AWS Secrets Manager secret (\`apex-ctrl/gemini\`) nor the \`GEMINI_API_KEY\` environment variable is configured.

Please set the \`apex-ctrl/gemini\` secret in AWS Secrets Manager or provide \`GEMINI_API_KEY\` in your environment to activate real-time Gemini race engineer analysis.`;

    return res.json({
      text: errorNotice
    });
  }

  try {
    const prompt = `
Provide a fresh, technical F1 Race Engineer analysis report based on the following OpenF1 session dataset:

SESSION DETAILS:
- Grand Prix / Circuit: ${location || "Unknown Circuit"}
- Session Focus: ${sessionName || "Race"}
- Session Key: ${activeSessionKey}
- Intelligence Goal: ${String(requestType || "General Strategy").toUpperCase()}

ACTIVE DRIVERS FIELD:
${drivers ? JSON.stringify(drivers) : "All active drivers"}

PRIMARY DRIVER TELEMETRY & SPECS:
${driverData ? JSON.stringify(driverData, null, 2) : "Driver specs unavailable in payload."}

LAP ANALYSIS DATA:
${lapsData ? JSON.stringify(lapsData, null, 2) : "Lap duration telemetry stream."}

TYRE DEGRADATION & STINTS:
${tyreData ? JSON.stringify(tyreData, null, 2) : "Tire compound life metrics."}

ATMOSPHERIC & WEATHER TELEMETRY:
${weatherData ? JSON.stringify(weatherData, null, 2) : "Weather data."}

INSTRUCTIONS:
- Act as the Chief Telemetry Engineer for APEX CTRL.
- Generate a unique, contextual report in Markdown focused specifically on the goal '${requestType || "General Strategy"}'.
- Refer directly to the drivers, lap times, tire compounds, and speeds supplied above.
- If OpenF1 telemetry data for a metric is absent or incomplete in the payload, explain why instead of fabricating fake data.
`;

    const reportText = await generateGeminiResponse(prompt, apiKey);
    const s3Key = `reports/${activeSessionKey}/analysis-${requestType || 'general'}-${Date.now()}.md`;
    uploadReportToS3(s3Key, reportText).catch(err => console.error("[AWS S3] Upload failed:", err.message));

    return res.json({
      text: reportText
    });
  } catch (err: any) {
    console.error("[getAnalysis Error]", err);
    const errMsg = `### Live Telemetry Analysis [APEX AI Engine]

**Error Executing Gemini Analysis**: ${err.message || "Failed to generate AI response"}

Please verify your Gemini API key or AWS Secrets Manager configuration (\`apex-ctrl/gemini\`).`;

    return res.json({
      text: errMsg
    });
  }
}


