# Burn After Reading

A secure self-destructing message system built with Next.js, Redis (Upstash), and Tailwind CSS.

## Features

- Create secret messages that self-destruct after being read
- Choose between one-time view or time-based expiration
- Secure message storage in Redis
- Unique access links for each message
- Email notifications when messages are read

## How It Works

1. **Create a Message**
   - Type your secret message
   - Choose an expiration method: one-time view or time-based (10 min, 30 min, 1 hour, 24 hours)
   - Submit the message to get a unique access link

2. **Share the Link**
   - Copy the generated link and share it with whoever you want

3. **Read and Destroy**
   - When the recipient opens the link, they'll see a warning that the message will be destroyed after viewing
   - After revealing the message, it's immediately deleted from the database if it's a one-time view
   - Time-based messages are automatically deleted after their expiration time on the Redis side
   - An email notification is sent to the configured email address when a message is read

## Technology Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Upstash Redis
- **Notifications**: Notify.cx for email notifications
- **Deployment**: Vercel (recommended?)

## Environment Variables

You need these env vars:

```
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
NOTIFY_API_KEY=your-notify-api-key
NOTIFICATION_EMAIL=your-notification-email@example.com
```