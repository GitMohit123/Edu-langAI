import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '@/lib/aws/config';
import { getSession } from '@/lib/getSession';

const CLASSES_TABLE = process.env.CLASSES_TABLE || 'Classes';
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, subject, code } = body;
        if (!title || !description || !subject || !code) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const user = await getSession();
        if (!user) {
            return NextResponse.redirect('/auth/login'); // Redirect to login if user is not authenticated
        }
        const classId = uuidv4();
        const createdAt = new Date().toISOString();
        const params = {
            TableName: CLASSES_TABLE,
            Item: {
                classId,
                title,
                description,
                subject,
                code,
                professorId: user.userId,
                professorName: user.name,
                createdAt,
            },
        };

        await dynamoDb.send(new PutCommand(params));
        return NextResponse.json({ message: 'Class created successfully', classId }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating class:', error);
        if (error.name === 'ValidationException') {
            return NextResponse.json({ error: 'Validation error' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}
