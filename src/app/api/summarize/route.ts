import { NextRequest, NextResponse } from "next/server";
import {
  countWords,
  extractDocumentText,
  splitTextIntoChunks,
} from "@/lib/document-text";

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";
const SUMMARY_MODEL = "google/gemini-3.5-flash";
const SUMMARY_MODEL_LABEL =
  "Gemini 3.5 Flash via OpenRouter";
const MAX_SUMMARY_INPUT_CHARS = 12000;

type SummarizeRequest = {
  s3FileUrl?: string;
  fileName?: string;
  length?: number;
  type?: "concise" | "detailed" | "bullet" | "academic";
};

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

const getSummaryTypeInstruction = (
  summaryType: NonNullable<SummarizeRequest["type"]>
) => {
  switch (summaryType) {
    case "detailed":
      return "Write a rich explanatory summary with short section headings, major ideas, supporting details, and any important examples or evidence.";
    case "bullet":
      return "Write the summary as clean bullet points. Group related ideas when helpful and keep each bullet information-dense.";
    case "academic":
      return "Use a formal academic tone. Emphasize thesis, methodology or structure, key arguments, findings, and implications.";
    case "concise":
    default:
      return "Write a concise summary in short paragraphs that captures only the most important ideas and conclusions.";
  }
};

const clampSummaryLength = (value?: number) => {
  const numericValue = Number(value ?? 50);

  if (!Number.isFinite(numericValue)) {
    return 50;
  }

  return Math.min(90, Math.max(10, Math.round(numericValue)));
};

const estimateTargetWords = (summaryLength: number) =>
  Math.round(120 + ((summaryLength - 10) / 80) * 580);

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

async function callOpenRouter(messages: ChatMessage[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured"
    );
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: SUMMARY_MODEL,
      temperature: 0.2,
      max_tokens: 1200,
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

  const summary = extractAssistantText(
    data?.choices?.[0]?.message?.content
  );

  if (!summary) {
    throw new Error("OpenRouter returned an empty summary");
  }

  return summary;
}

async function summarizeChunk(
  text: string,
  summaryType: NonNullable<SummarizeRequest["type"]>,
  fileName: string,
  chunkIndex: number,
  totalChunks: number
) {
  return callOpenRouter([
    {
      role: "system",
      content:
        "You summarize academic and classroom documents accurately. Preserve important facts, terminology, names, numbers, and conclusions. Do not invent content.",
    },
    {
      role: "user",
      content: `You are summarizing chunk ${chunkIndex} of ${totalChunks} from the document "${fileName}".

${getSummaryTypeInstruction(summaryType)}

Create an intermediate summary of this chunk in 120 to 180 words. Focus on the most important ideas, definitions, evidence, and conclusions that must survive into a final document-wide summary.

Chunk text:
${text}`,
    },
  ]);
}

async function summarizeDocument(
  extractedText: string,
  summaryType: NonNullable<SummarizeRequest["type"]>,
  summaryLength: number,
  fileName: string
) {
  const targetWords = estimateTargetWords(summaryLength);
  const chunks = splitTextIntoChunks(
    extractedText,
    MAX_SUMMARY_INPUT_CHARS
  );

  let sourceForFinalSummary = extractedText;

  if (chunks.length > 1) {
    const chunkSummaries: string[] = [];

    for (const [index, chunk] of chunks.entries()) {
      const chunkSummary = await summarizeChunk(
        chunk,
        summaryType,
        fileName,
        index + 1,
        chunks.length
      );

      chunkSummaries.push(
        `Chunk ${index + 1} summary:\n${chunkSummary}`
      );
    }

    sourceForFinalSummary = chunkSummaries.join("\n\n");
  }

  const summary = await callOpenRouter([
    {
      role: "system",
      content:
        "You create polished, highly accurate summaries for educational documents. Preserve nuance, avoid repetition, and do not include information that is not supported by the source.",
    },
    {
      role: "user",
      content: `Summarize the document "${fileName}".

${getSummaryTypeInstruction(summaryType)}

Aim for about ${targetWords} words. Keep the summary easy to scan, factually grounded, and useful for a student reviewing the document quickly.

Do not use markdown tables. Do not mention that you are an AI model. Return only the final summary text.

Source material:
${sourceForFinalSummary}`,
    },
  ]);

  return {
    summary,
    targetWords,
    chunkCount: chunks.length,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SummarizeRequest;
    const summaryType = body.type || "concise";
    const summaryLength = clampSummaryLength(body.length);

    if (!body.s3FileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "s3FileUrl is required",
        },
        { status: 400 }
      );
    }

    const { extractedText, jobId } = await extractDocumentText({
      s3FileUrl: body.s3FileUrl,
    });

    const fileName = body.fileName?.trim() || "document";
    const { summary, targetWords, chunkCount } =
      await summarizeDocument(
        extractedText,
        summaryType,
        summaryLength,
        fileName
      );

    return NextResponse.json({
      success: true,
      summary,
      extractedText,
      jobId,
      model: SUMMARY_MODEL,
      modelLabel: SUMMARY_MODEL_LABEL,
      summaryType,
      summaryLength,
      targetWords,
      sourceWordCount: countWords(extractedText),
      summaryWordCount: countWords(summary),
      chunkCount,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    const status =
      errorMessage.includes("required") ||
      errorMessage.includes("Provide") ||
      errorMessage.includes("OPENROUTER_API_KEY")
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status }
    );
  }
}
