import { NextResponse } from 'next/server';
import { dynamoDb } from '@/lib/aws/config';
import { getSession } from '@/lib/getSession';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET() {
  try {
    const session = await getSession();   

    if (!session || !session.userId) {
      return NextResponse.redirect('/auth/login');
    }

    const professorId = session.userId;
    const classes = await dynamoDb.send(new ScanCommand({
      TableName: process.env.CLASSES_TABLE,
      FilterExpression: 'professorId = :professorId',
      ExpressionAttributeValues: {
        ':professorId': professorId
      }
    }));

    return NextResponse.json(classes.Items || []); // Ensure we return an array
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes'}, { status: 500 });
  }
}
