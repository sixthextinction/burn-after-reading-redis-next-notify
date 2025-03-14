'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  content: string;
  expirationType: 'one-time' | 'time-based';
  expirationValue: string | null;
  createdAt: number;
}

export default function ReadMessage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to retrieve message');
        }

        setMessage(data.message);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [params.id]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Secret Message</h1>

        {isLoading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading message...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-md">
              <p className="text-red-800 dark:text-red-200 mb-2">
                {error === 'Message not found or has expired' 
                  ? 'This message has expired or has already been read.' 
                  : error}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Secret messages are designed to be read only once or within a specific time period.
              </p>
            </div>
            <Link
              href="/"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center"
            >
              Create a New Message
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {!isRevealed ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                  <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                    Warning: This message will be destroyed after viewing.
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Once revealed, the message cannot be accessed again.

                    Are you ready?
                  </p>
                </div>
                <button
                  onClick={handleReveal}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                >
                  Ready! Show me the secret message.
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md">
                  <h2 className="text-lg font-medium mb-2">Secret Message:</h2>
                  <div className="whitespace-pre-wrap">{message?.content}</div>
                </div>
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-md">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    This message has been destroyed and cannot be accessed again. Make sure you&apos;ve read it before navigating away.
                  </p>
                </div>
                <Link
                  href="/"
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center"
                >
                  Create a New Message
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 