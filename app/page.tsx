'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('');
  const [expirationType, setExpirationType] = useState('one-time');
  const [expirationValue, setExpirationValue] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          expirationType,
          expirationValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create message');
      }

      setMessageId(data.messageId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLink = messageId ? `${window.location.origin}/read/${messageId}` : '';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Burn After Reading</h1>
        
        {!messageId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Secret Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md min-h-32 bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder="Type your secret message here..."
                required
              />
            </div>

            <div>
              <label htmlFor="expirationType" className="block text-sm font-medium mb-1">
                Expiration Type
              </label>
              <select
                id="expirationType"
                value={expirationType}
                onChange={(e) => setExpirationType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="one-time">One-time view (disappears after reading)</option>
                <option value="time-based">Time-based expiry</option>
              </select>
            </div>

            {expirationType === 'time-based' && (
              <div>
                <label htmlFor="expirationValue" className="block text-sm font-medium mb-1">
                  Expiration Time (minutes)
                </label>
                <select
                  id="expirationValue"
                  value={expirationValue}
                  onChange={(e) => setExpirationValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">24 hours</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Secret Message'}
            </button>

            {error && (
              <div className="p-2 text-red-500 text-sm">{error}</div>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md">
              <p className="text-green-800 dark:text-green-200 mb-2">
                Your secret message has been created!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Share this link with the recipient. The message will be destroyed after reading
                {expirationType === 'time-based' && ` or after ${expirationValue} minutes`}.
              </p>
            </div>

            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md break-all">
              <p className="text-sm font-mono">{messageLink}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(messageLink)}
                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md"
              >
                Copy Link
              </button>
              <Link
                href={`/read/${messageId}`}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center"
              >
                View Message
              </Link>
            </div>

            <button
              onClick={() => setMessageId(null)}
              className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md mt-4"
            >
              Create Another Message
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
