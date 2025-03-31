import { dynamoDb } from '@/lib/aws/config';
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const CLASSES_TABLE = process.env.CLASSES_TABLE || 'dev-classes';

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  const { classId } = await params;
  console.log(classId)
  if (!classId) {
    return NextResponse.json({ message: 'classId is required' }, { status: 400 });
  }
  try {
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: CLASSES_TABLE,
        IndexName: 'GSI_ClassId', // ✅ Your new GSI
        KeyConditionExpression: 'classId = :id',
        ExpressionAttributeValues: {
          ':id': classId,
        },
      })
    );

    const classItem = result.Items?.[0];

    if (!classItem) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(classItem, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching class:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
