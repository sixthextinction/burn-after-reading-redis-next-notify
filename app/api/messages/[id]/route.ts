import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // step 1: get message from redis
    const messageData = await redis.get(messageId);

    console.log("found =", messageData);

    if (!messageData) {
      return NextResponse.json(
        { error: 'Message not found or has expired' },
        { status: 404 }
      );
    }

    // step 2: parse message from redis
    const parsedMessage = typeof messageData === 'string' 
      ? JSON.parse(messageData) 
      : messageData;

    // step 3. if it's a one-time view message, delete it immediately
    // (if timer based expiration, don't bother, redis will handle that)
    if (parsedMessage.expirationType === 'one-time') {
      await redis.del(messageId);
    }

    // step 4. return message
    return NextResponse.json({ message: parsedMessage });
  } catch (error) {
    console.error('Error retrieving message:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve message' },
      { status: 500 }
    );
  }
} 