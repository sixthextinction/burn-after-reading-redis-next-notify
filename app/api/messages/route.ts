import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/app/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { message, expirationType, expirationValue } = await request.json();

    // step 1. basic validation
    // TODO: add actual validation with zod etc.
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!expirationType || !['one-time', 'time-based'].includes(expirationType)) {
      return NextResponse.json(
        { error: 'Valid expiration type is required' },
        { status: 400 }
      );
    }

    if (expirationType === 'time-based' && !expirationValue) {
      return NextResponse.json(
        { error: 'Expiration value is required for time-based expiry' },
        { status: 400 }
      );
    }

    // step 2. generate a unique ID for the message 
    // TODO: maybe dont use uuid? idk
    const messageId = uuidv4();

    // step 3. store message in redis
    const messageData = {
      content: message,
      expirationType,
      expirationValue: expirationType === 'time-based' ? expirationValue : null,
      createdAt: Date.now(),
    };

    // step 4. store message in redis
    await redis.set(messageId, JSON.stringify(messageData));
    console.log(`Message ${messageId} created successfully`);

    // step 5. set expiration if time-based
    if (expirationType === 'time-based') {
      // redis requires values in secnods so convert this
      const expiryInSeconds = parseInt(expirationValue) * 60;
      await redis.expire(messageId, expiryInSeconds);
      console.log(`Set expiration for ${messageId}: ${expiryInSeconds} seconds`);
    }

    return NextResponse.json({ messageId });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
} 