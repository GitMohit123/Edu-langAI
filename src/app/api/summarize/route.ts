import { NextRequest, NextResponse } from "next/server";
import {
  countWords,
  extractDocumentText,
  splitTextIntoChunks,
} from "@/lib/document-text";
import {
  callOpenRouterChat,
  GEMINI_FLASH_LABEL,
  GEMINI_FLASH_MODEL,
  type OpenRouterChatMessage,
} from "@/lib/openrouter";

const SUMMARY_MODEL = GEMINI_FLASH_MODEL;
const SUMMARY_MODEL_LABEL = GEMINI_FLASH_LABEL;
const MAX_SUMMARY_INPUT_CHARS = 12000;

type SummarizeRequest = {
  s3FileUrl?: string;
  fileName?: string;
  length?: number;
  type?: "concise" | "detailed" | "bullet" | "academic";
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

async function summarizeChunk(
  text: string,
  summaryType: NonNullable<SummarizeRequest["type"]>,
  fileName: string,
  chunkIndex: number,
  totalChunks: number
) {
  const messages: OpenRouterChatMessage[] = [
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
  ];

  const { text: summary } = await callOpenRouterChat({
    model: SUMMARY_MODEL,
    messages,
    maxTokens: 500,
  });

  return summary;
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

  const messages: OpenRouterChatMessage[] = [
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
  ];

  const { text: summary } = await callOpenRouterChat({
    model: SUMMARY_MODEL,
    messages,
    maxTokens: 1200,
  });

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
