import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '@/lib/aws/config';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';

const CLASSES_TABLE = process.env.CLASSES_TABLE;
const STUDENT_CLASSES_TABLE = process.env.STUDENT_CLASSES_TABLE;
export async function POST(request: Request) {
    
    const user = await getSession();
    const { classCode } = await request.json();
    console.log(classCode);
    if (!classCode || !user) {
        return NextResponse.json({ error: 'Class code and student ID are required.' }, { status: 400 });
    }

    try {
        // Fetch class details from the classes table using the class code
        const result = await dynamoDb.send(new QueryCommand({
            TableName: CLASSES_TABLE,
            IndexName: 'GSI_Code', // Must match your GSI name
            KeyConditionExpression: 'code = :codeVal',
            ExpressionAttributeValues: {
              ':codeVal': classCode,
            },
          }));
      
          if (!result.Items || result.Items.length === 0) {
            return NextResponse.json({ message: 'Class not found' }, { status: 404 });
          }
      
          const classDetails = result.Items[0];
        const { classId, professorId, title, professorName } = classDetails;

        // Insert the join record into the students table
        const params = {
            TableName: STUDENT_CLASSES_TABLE,
            Item: {
                classId,
                studentId: user.userId,
                professorId,
                professorName,
                joinedAt: new Date().toISOString(),
                title,
            },
        };
        await dynamoDb.send(new PutCommand(params));

        return NextResponse.json({ message: 'Successfully joined the class.' }, { status: 200 });
    } catch (error) {
        console.error('Error joining class:', error);
        return NextResponse.json({ error: 'An error occurred while joining the class.' }, { status: 500 });
    }
}
