import { dynamoDb } from '@/lib/aws/config';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { hashPassword, verifyPassword, generateToken } from '@/lib/aws/auth';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/aws/models/user';

const USERS_TABLE = process.env.USERS_TABLE || 'Users';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    if (!bodyText || bodyText.trim() === '') {
      return NextResponse.json({ message: 'Missing body' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Query using email as SK (assuming GSI on email)
    const userQuery = await dynamoDb.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'GSI_Email', // You must create a GSI with email as PK or SK
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    const user = userQuery.Items?.[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Optionally create JWT token
    const token = generateToken(user as User);
    const response = NextResponse.json(
      { message: 'Login successful', user, token },
      { status: 200 }
    );
    response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
      });
    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message || 'Internal error' }, { status: 500 });
  }
}
