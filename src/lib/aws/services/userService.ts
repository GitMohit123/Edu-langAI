import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../config";
import { USERS_TABLE, User, UserCreateInput, UserUpdateInput } from "../models/user";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  async createUser(input: UserCreateInput): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      userId: uuidv4(),
      ...input,
      tokensAvailable: 100,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { id },
      })
    );

    return result.Item as User || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
    );

    return result.Items?.[0] as User || null;
  }

  async updateUser(id: string, input: UserUpdateInput): Promise<User | null> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (input.name) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = input.name;
    }

    if (input.email) {
      updateExpressions.push('#email = :email');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = input.email;
    }

    if (input.password) {
      updateExpressions.push('#password = :password');
      expressionAttributeNames['#password'] = 'password';
      expressionAttributeValues[':password'] = input.password;
    }

    if (input.tokensAvailable) {
      updateExpressions.push('#tokensAvailable = :tokensAvailable');
      expressionAttributeNames['#tokensAvailable'] = 'tokensAvailable';
      expressionAttributeValues[':tokensAvailable'] = input.tokensAvailable;
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as User || null;
  }
} 