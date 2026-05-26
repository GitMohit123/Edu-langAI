import { NextResponse } from "next/server";
import { extractDocumentText } from "@/lib/document-text";

export async function POST(request: Request) {
  try {
    const { s3FileUrl } = await request.json();

    if (!s3FileUrl) {
      return NextResponse.json(
        { error: "s3FileUrl is required" },
        { status: 400 }
      );
    }

    const { extractedText, jobId } = await extractDocumentText({
      s3FileUrl,
    });

    return NextResponse.json({
      extracted_text: extractedText,
      job_id: jobId,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred";

    const status =
      errorMessage.includes("Provide") ? 400 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
