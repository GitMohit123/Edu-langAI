import { NextRequest, NextResponse } from 'next/server';
import { dynamoDb } from '@/lib/aws/config';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/getSession';

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'Documents';

export async function POST(req: NextRequest) {
  try {
    const { classId, fileName, fileUrl } = await req.json();
    const user = await getSession();
    if(!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!classId || !fileName || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const documentId = uuidv4();
    const createdAt = new Date().toISOString();
    const userId = user.userId;

    const item = {
      documentId,
      classId,
      fileName,
      fileUrl,
      createdAt,
      uploadedBy: userId,
    };

    await dynamoDb.send(new PutCommand({
      TableName: DOCUMENTS_TABLE,
      Item: item,
    }));

    return NextResponse.json({ message: 'Document saved successfully', document: item }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving document:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}
