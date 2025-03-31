import { NextRequest, NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/aws/s3';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const classId = formData.get('classId')?.toString();
    const rawFiles = formData.getAll('files');
    if (!rawFiles || rawFiles.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 });
    }
    // Type guard: filter only valid File objects
    const files = rawFiles.filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: 'No valid files found in request' }, { status: 400 });
    }
    const uploadResponses = await Promise.all(
      files.map(async (file) => {
        if (!file.name || !file.type) {
          throw new Error(`Invalid file: ${file.name}`);
        }
        try {
          return await generateUploadUrl(file.type, classId || 'general', file.name);
        } catch (err) {
          console.error(`Failed to generate URL for file: ${file.name}`, err);
          throw new Error(`Could not process file: ${file.name}`);
        }
      })
    );

    return NextResponse.json({ message: 'Upload URLs generated', data: uploadResponses }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating upload URLs:', error);
    return NextResponse.json({
      error: error.message || 'Something went wrong while processing your request',
    }, { status: 500 });
  }
}
