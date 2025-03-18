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

## Local Development

1. Clone this repository
2. Install dependencies with `npm install` or `yarn`
3. Copy `.env.example` to `.env.local` and fill in required values
4. Run the development server with `npm run dev` or `yarn dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

You need these env vars:

```
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
NOTIFY_API_KEY=your-notify-api-key
NOTIFICATION_EMAIL=your-notification-email@example.com
```

## Security Considerations

- Messages are stored in Redis with encryption at rest (if [Upstash](https://upstash.com/) Redis Enterprise is used)
- Email notifications are sent using [Notify](https://notify.cx/), read their [docs](https://notify.cx/docs) if you want to know more about the email side of things

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.