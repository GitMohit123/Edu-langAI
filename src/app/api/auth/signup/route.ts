import { v4 as uuidv4 } from 'uuid';
import { dynamoDb } from '@/lib/aws/config';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword } from '@/lib/aws/auth';
import { User } from '@/lib/aws/models/user';

const USERS_TABLE = process.env.USERS_TABLE || 'Users';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    if (!bodyText || bodyText.trim() === '') {
      return NextResponse.json({ message: 'Request body is missing' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, email, password, role } = body;
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await dynamoDb.send(new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    if (existingUser.Items && existingUser.Items.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();
    const newUser = {
      userId: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      tokensAvailable: 1000,
      createdAt: now,
      updatedAt: now,
    };
    const token = generateToken(newUser as User);
    const response = NextResponse.json(
      { message: 'User created successfully', newUser, token },
      { status: 200 }
    );
    response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
      });

    await dynamoDb.send(new PutCommand({ TableName: USERS_TABLE, Item: newUser }));
    return response;

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server Error' }, { status: 500 });
  }
}
