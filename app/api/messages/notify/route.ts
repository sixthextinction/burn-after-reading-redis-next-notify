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

    // Format the date in a more readable way
    const readDate = new Date(readTime);
    const formattedDate = readDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    // send the notification email using Notify
    // https://notify.cx/docs/sending-individual-emails
    // const response = await fetch('https://notify.cx/api/send-email', {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOTIFY_API_KEY || ''
      },
      body: JSON.stringify({
        subject: `[Burn After Reading] Your secret message was read`,
        to: notificationEmail,
        message: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #dc2626;
              color: white;
              padding: 10px 20px;
              border-radius: 5px 5px 0 0;
              margin-bottom: 20px;
            }
            .message-content {
              background-color: #fff;
              border: 1px solid #eee;
              border-left: 4px solid #dc2626;
              padding: 15px;
              margin: 20px 0;
              border-radius: 3px;
            }
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 30px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Secret Message Read Alert</h2>
            </div>
            
            <p>Your secret message with ID <strong>${messageId}</strong> was read on:</p>
            <p><strong>${formattedDate}</strong></p>
            
            <p>Message content preview:</p>
            <div class="message-content">
              ${truncatedContent}
            </div>
            
            <p>This message has now been ${messageContent ? 'destroyed' : 'accessed'} according to your settings.</p>
            
            <div class="footer">
              <p>This is an automated notification from Burn After Reading.</p>
              <p>Powered by Next.js, Upstash Redis, and Notify.</p>
            </div>
          </div>
        </body>
        </html>
        `
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