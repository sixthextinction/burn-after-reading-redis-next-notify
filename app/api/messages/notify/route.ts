import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messageId, messageContent, readTime } = await request.json();

    // basic validation
    // TODO: proper validation
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // get the notification email address from ENV
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    
    if (!notificationEmail) {
      console.error('NOTIFICATION_EMAIL environment variable is not set');
      return NextResponse.json(
        { error: 'Notification email is not configured' },
        { status: 500 }
      );
    }

    // prep a truncated version of the message content for the email
    // limit to first 160 characters to avoid sending very large emails
    const truncatedContent = messageContent 
      ? messageContent.length > 160 
        ? messageContent.substring(0, 160) + '...' 
        : messageContent
      : '[No content]';

    // send the notification email using Notify
    // https://notify.cx/docs/sending-individual-emails
    const response = await fetch('https://notify.cx/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOTIFY_API_KEY || ''
      },
      body: JSON.stringify({
        subject: `[Burn After Reading] Your secret message was read.`,
        to: notificationEmail,
        message: `Your secret message was read at ${readTime}.
        
        Message content follows: 
        
        ${truncatedContent}`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send notification: ${errorData.error || response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 