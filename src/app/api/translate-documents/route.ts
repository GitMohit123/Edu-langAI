import { NextRequest, NextResponse } from "next/server";

import {
  TextractClient,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";

import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

const REGION = process.env.AWS_REGION || "ap-south-1";

const textractClient = new TextractClient({
  region: REGION,
});

const translateClient = new TranslateClient({
  region: REGION,
});

const MAX_TRANSLATE_CHARS = 4500;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type TranslateDocumentRequest = {
  bucketName?: string;
  objectKey?: string;
  s3FileUrl?: string;
  targetLanguage?: string;
};

const resolveS3Location = ({
  bucketName,
  objectKey,
  s3FileUrl,
}: TranslateDocumentRequest) => {
  let resolvedBucketName = bucketName?.trim();
  let resolvedObjectKey = objectKey?.trim();

  if ((!resolvedBucketName || !resolvedObjectKey) && s3FileUrl) {
    try {
      const url = new URL(s3FileUrl);

      resolvedBucketName =
        resolvedBucketName || url.hostname.split(".")[0];
      resolvedObjectKey =
        resolvedObjectKey ||
        decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    } catch {
      throw new Error("Provide a valid s3FileUrl");
    }
  }

  if (!resolvedBucketName || !resolvedObjectKey) {
    throw new Error(
      "Provide bucketName and objectKey, or a valid s3FileUrl"
    );
  }

  return {
    bucketName: resolvedBucketName,
    objectKey: resolvedObjectKey,
  };
};

const splitTextIntoChunks = (
  text: string,
  maxChars = MAX_TRANSLATE_CHARS
) => {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  const lines = normalizedText.split("\n");
  const chunks: string[] = [];
  let currentChunk = "";

  const pushChunk = () => {
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.length > maxChars) {
      pushChunk();

      for (let index = 0; index < line.length; index += maxChars) {
        chunks.push(line.slice(index, index + maxChars));
      }

      continue;
    }

    const nextChunk = currentChunk
      ? `${currentChunk}\n${line}`
      : line;

    if (nextChunk.length > maxChars) {
      pushChunk();
      currentChunk = line;
    } else {
      currentChunk = nextChunk;
    }
  }

  pushChunk();

  return chunks;
};

export async function POST(req: NextRequest) {
  try {
    const body =
      (await req.json()) as TranslateDocumentRequest;

    const { targetLanguage = "hi" } = body;
    const { bucketName, objectKey } =
      resolveS3Location(body);

    /*
      Example body:

      {
        "s3FileUrl": "https://my-public-bucket.s3.ap-south-1.amazonaws.com/documents/sample.pdf",
        "targetLanguage": "hi"
      }
    */

    /*
      STEP 1
      Start Textract async job
    */

    const startCommand =
      new StartDocumentTextDetectionCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: bucketName,
            Name: objectKey,
          },
        },
      });

    const startResponse = await textractClient.send(
      startCommand
    );

    const jobId = startResponse.JobId;

    if (!jobId) {
      throw new Error("Failed to create Textract job");
    }

    /*
      STEP 2
      Poll Textract job status
    */

    let jobStatus = "IN_PROGRESS";
    let extractedText = "";

    while (jobStatus === "IN_PROGRESS") {
      await sleep(3000);

      const getCommand =
        new GetDocumentTextDetectionCommand({
          JobId: jobId,
        });

      const result = await textractClient.send(
        getCommand
      );

      jobStatus = result.JobStatus || "FAILED";

      console.log("Textract Job Status:", jobStatus);

      if (jobStatus === "SUCCEEDED") {
        const blocks = [...(result.Blocks || [])];
        let nextToken = result.NextToken;

        while (nextToken) {
          const nextPage = await textractClient.send(
            new GetDocumentTextDetectionCommand({
              JobId: jobId,
              NextToken: nextToken,
            })
          );

          blocks.push(...(nextPage.Blocks || []));
          nextToken = nextPage.NextToken;
        }

        extractedText = blocks
          .filter(
            (block) =>
              block.BlockType === "LINE" &&
              block.Text
          )
          .map((block) => block.Text)
          .join("\n");
      }

      if (jobStatus === "FAILED") {
        throw new Error("Textract job failed");
      }
    }

    if (!extractedText.trim()) {
      throw new Error(
        "No text could be extracted from the document"
      );
    }

    /*
      STEP 3
      Translate extracted text
    */

    const translatedChunks: string[] = [];

    for (const textChunk of splitTextIntoChunks(extractedText)) {
      const translatedResponse =
        await translateClient.send(
          new TranslateTextCommand({
            Text: textChunk,
            SourceLanguageCode: "en",
            TargetLanguageCode: targetLanguage,
          })
        );

      translatedChunks.push(
        translatedResponse.TranslatedText || ""
      );
    }

    const translatedText = translatedChunks.join("\n");

    /*
      STEP 4
      Return response
    */

    return NextResponse.json({
      success: true,
      jobId,
      extractedText,
      translatedText,
      targetLanguage,
    });
  } catch (error: any) {
    console.error("ERROR:", error);

    const status =
      error?.message?.includes("Provide bucketName") ||
      error?.message?.includes("Provide a valid s3FileUrl")
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong",
      },
      {
        status,
      }
    );
  }
}