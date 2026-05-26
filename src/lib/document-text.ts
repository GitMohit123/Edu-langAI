import {
  GetDocumentTextDetectionCommand,
  StartDocumentTextDetectionCommand,
  TextractClient,
} from "@aws-sdk/client-textract";

const REGION = process.env.AWS_REGION || "ap-south-1";
const textractClient = new TextractClient({
  region: REGION,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export type S3DocumentInput = {
  bucketName?: string;
  objectKey?: string;
  s3FileUrl?: string;
};

export const resolveS3Location = ({
  bucketName,
  objectKey,
  s3FileUrl,
}: S3DocumentInput) => {
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

export const splitTextIntoChunks = (
  text: string,
  maxChars: number
) => {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let currentChunk = "";

  const pushChunk = () => {
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      pushChunk();

      for (
        let index = 0;
        index < paragraph.length;
        index += maxChars
      ) {
        chunks.push(paragraph.slice(index, index + maxChars));
      }

      continue;
    }

    const nextChunk = currentChunk
      ? `${currentChunk}\n\n${paragraph}`
      : paragraph;

    if (nextChunk.length > maxChars) {
      pushChunk();
      currentChunk = paragraph;
    } else {
      currentChunk = nextChunk;
    }
  }

  pushChunk();

  return chunks;
};

export const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export async function extractDocumentText(
  input: S3DocumentInput
) {
  const { bucketName, objectKey } = resolveS3Location(input);

  const startResponse = await textractClient.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: objectKey,
        },
      },
    })
  );

  const jobId = startResponse.JobId;

  if (!jobId) {
    throw new Error("Failed to create Textract job");
  }

  let jobStatus = "IN_PROGRESS";
  let extractedText = "";

  while (jobStatus === "IN_PROGRESS") {
    await sleep(3000);

    const result = await textractClient.send(
      new GetDocumentTextDetectionCommand({
        JobId: jobId,
      })
    );

    jobStatus = result.JobStatus || "FAILED";

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
            block.BlockType === "LINE" && block.Text
        )
        .map((block) => block.Text)
        .join("\n");
    }

    if (jobStatus === "FAILED") {
      throw new Error("Textract job failed");
    }
  }

  const normalizedText = extractedText.trim();

  if (!normalizedText) {
    throw new Error(
      "No text could be extracted from the document"
    );
  }

  return {
    jobId,
    extractedText: normalizedText,
  };
}
