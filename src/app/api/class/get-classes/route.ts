import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '@/lib/aws/config';
import { getSession } from '@/lib/getSession';
import { NextResponse } from 'next/server';

const STUDENT_CLASSES_TABLE = process.env.STUDENT_CLASSES_TABLE;

export async function GET(request: Request) {
    const user = await getSession();
    if (!user) {
        return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    try {
        const studentId = user.userId;
        // Fetch all classes for the student from the student classes table
        const result = await dynamoDb.send(new QueryCommand({
            TableName: STUDENT_CLASSES_TABLE,
            IndexName: 'GSI_StudentId', // must match your GSI name
            KeyConditionExpression: 'studentId = :pid',
            ExpressionAttributeValues: {
              ':pid': studentId,
            },
          }));

        if (!result.Items) {
            return NextResponse.json({ message: 'No classes found for this student.' }, { status: 404 });
        }

        return NextResponse.json(result.Items, { status: 200 });
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json({ error: 'An error occurred while fetching classes.' }, { status: 500 });
    }
}
