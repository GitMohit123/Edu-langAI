import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '@/lib/aws/config';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;

export async function GET(request: Request, { params }: { params: { classId: string } }) {
    try {
        const user = await getSession();
        const { classId } = await params;

        if (!classId) {
            return NextResponse.json({ error: 'Class ID is required.' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: 'User session is required.' }, { status: 401 });
        }

        // Fetch class details from the documents table using the class ID
        const result = await dynamoDb.send(new QueryCommand({
            TableName: DOCUMENTS_TABLE,
            IndexName: 'GSI_ClassId', // Must match your GSI name
            KeyConditionExpression: 'classId = :classIdVal',
            ExpressionAttributeValues: {
                ':classIdVal': classId,
            },
        }));

        if (!result.Items) {
            return NextResponse.json({ message: 'No documents found for the specified class.' }, { status: 404 });
        }

        const documents = result.Items || [];
        return NextResponse.json(documents, { status: 200 });

    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'An error occurred while fetching documents.' }, { status: 500 });
    }
}
