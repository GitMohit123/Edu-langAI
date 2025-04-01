import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { s3FileUrl } = await request.json();
    if (!s3FileUrl) {
      return NextResponse.json({ error: 's3FileUrl is required' }, { status: 400 });
    }

    // Extract bucket name and file key from the S3 URL
    const urlParts = new URL(s3FileUrl);
    const bucketName = urlParts.hostname.split('.')[0]; // Assuming the bucket name is the first part of the hostname
    const fileKey = decodeURIComponent(urlParts.pathname.slice(1)); // Remove leading '/' and decode

    // Call your Lambda function API
    const response = await fetch(process.env.TEXT_EXTRACT_LAMBDA_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket_name: bucketName,
        file_key: fileKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract text from the document');
    }

    const data = await response.json();
    return NextResponse.json({ extracted_text: data.extracted_text });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
