export const GEMINI_FLASH_MODEL = "google/gemini-3.5-flash";
export const GEMINI_FLASH_LABEL =
  "Gemini 3.5 Flash via OpenRouter";

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const extractAssistantText = (content: unknown) => {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (
          part &&
          typeof part === "object" &&
          "type" in part &&
          "text" in part &&
          part.type === "text"
        ) {
          return String(part.text);
        }

        return "";
      })
      .join("")
      .trim();
  }

  return "";
};

type CallOpenRouterOptions = {
  messages: OpenRouterChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export async function callOpenRouterChat({
  messages,
  model = GEMINI_FLASH_MODEL,
  temperature = 0.2,
  maxTokens = 1200,
}: CallOpenRouterOptions) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      messages,
    }),
  });

  const responseText = await response.text();
  let data: any = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {
      message: responseText,
    };
  }

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      data?.message ||
      "OpenRouter request failed";

    throw new Error(errorMessage);
  }

  const text = extractAssistantText(
    data?.choices?.[0]?.message?.content
  );

  if (!text) {
    throw new Error("OpenRouter returned an empty response");
  }

  return {
    text,
    model,
  };
}
