import { NextRequest, NextResponse } from "next/server";
import redis from "@/app/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: messageId } = await params;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // step 1: get message from redis
    const messageData = await redis.get(messageId);

    if (!messageData) {
      return NextResponse.json(
        { error: "Message not found or has expired" },
        { status: 404 }
      );
    }

    // step 2: parse message from redis
    const parsedMessage =
      typeof messageData === "string" ? JSON.parse(messageData) : messageData;

    // NOTE: no automatic deletion on GET - we'll use DELETE for that

    // step 3. return message
    return NextResponse.json({ message: parsedMessage });
  } catch (error) {
    console.error("Error retrieving message:", error);
    return NextResponse.json(
      { error: "Failed to retrieve message" },
      { status: 500 }
    );
  }
}

// DELETE method to handle explicit deletion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: messageId } = await params;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // step 1: get the message first to return it
    const messageData = await redis.get(messageId);

    if (!messageData) {
      return NextResponse.json(
        { error: "Message not found or has expired" },
        { status: 404 }
      );
    }

    // step 2: parse message from redis
    const parsedMessage =
      typeof messageData === "string" ? JSON.parse(messageData) : messageData;

    // step 3: delete the message from Redis
    await redis.del(messageId);

    // step 4: return the deleted message
    return NextResponse.json({
      success: true,
      message: parsedMessage,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
