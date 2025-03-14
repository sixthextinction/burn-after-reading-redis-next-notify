"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ImSpinner2,
  ImWarning,
  ImEye,
  ImBin,
  ImQuotesLeft,
  ImQuotesRight,
} from "react-icons/im";

interface Message {
  content: string;
  expirationType: "one-time" | "time-based";
  expirationValue: string | null;
  createdAt: number;
}

export default function ReadMessage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Simple GET request - no action parameter needed
        const response = await fetch(`/api/messages/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to retrieve message");
        }

        setMessage(data.message);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleReveal = () => {
    setIsRevealed(true);
    
    // Only delete one-time messages after the user has seen them
    if (message?.expirationType === "one-time") {
      deleteMessage();
    }
  };
  
  const deleteMessage = async () => {
    try {
      // Use DELETE HTTP method
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsDeleted(true);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  return (
    <main className="flex min-h-screen max-w-5xl mx-auto flex-col items-center justify-center p-4 md:p-24">
      {/* logo and branding */}
      <Logo />

      <div className="w-full bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-center text-white">
          Secret Message
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <ImSpinner2 className="text-white size-12 animate-spin mb-4" />
            <p className="text-white">Loading your secret message...</p>
          </div>
        ) : error ? (
          <div className="space-y-5 flex flex-col">
            <div className="p-4 bg-black/50 border border-red-500/50 rounded-lg">
              <div className="flex items-start">
                <ImWarning className="text-red-500 size-5 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-red-500 font-medium mb-1">
                    {error === "Message not found or has expired"
                      ? "This message has expired or has already been read."
                      : error}
                  </h3>
                  <p className="text-sm text-white">
                    Secret messages are designed to be read only once or within
                    a specific time period.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="relative overflow-hidden group w-full py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-center"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
              <span className="z-10 w-full">Create a New Message</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {!isRevealed ? (
              <div className="space-y-5 flex flex-col">
                <div className="p-4 bg-black/50 border border-yellow-500/50 rounded-lg">
                  <div className="flex items-start">
                    <ImWarning className="text-yellow-500 size-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-500 font-medium mb-1">
                        Warning: This message will self-destruct
                      </h3>
                      {message?.expirationType === 'one-time' ? (
                        <p className="text-sm text-white">
                          Once revealed, this message cannot be accessed again. It
                          will be permanently deleted. Are you ready?
                        </p>
                      ) : (
                        <p className="text-sm text-white">
                          This message will expire in {message?.expirationValue} minutes. Are you ready?
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReveal}
                  className="relative overflow-hidden group w-full py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
                  <ImEye className="size-4 mr-2 relative z-10" />
                  <span className="relative z-10 w-full">Ready! Show me the message.</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5 flex flex-col">
                <div className="p-6 bg-gradient-to-br from-black/70 to-black/40 border border-white/20 rounded-lg shadow-lg relative overflow-hidden">
                  <div className="absolute top-3 left-3 opacity-20">
                    <ImQuotesLeft className="text-red-500 size-6" />
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-20">
                    <ImQuotesRight className="text-red-500 size-6" />
                  </div>

                  <div className="relative">
                    <div className="mb-4 flex justify-end">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-full opacity-30"></div>
                    </div>

                    <div className="whitespace-pre-wrap text-white p-4 bg-black/60 rounded-lg border border-white/10 leading-relaxed tracking-wide text-lg font-normal shadow-inner">
                      {message?.content}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-full opacity-30"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/50 border border-red-500/50 rounded-lg">
                  <div className="flex items-start">
                    <ImBin className="text-red-500 size-5 mr-2 mt-0.5" />
                    <p className="text-sm text-white">
                      {isDeleted 
                        ? "This message has now been destroyed and cannot be read again."
                        : message?.expirationType === "time-based" 
                          ? `This message will expire after ${message?.expirationValue} minutes.`
                          : "This message will be destroyed when you leave this page."}
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="relative overflow-hidden group w-full py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
                  <span className="relative z-10">Create a New Message</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* footer with subtle branding */}
      <div className="mt-12 text-center text-xs text-white">
        <p>Powered by NextJS, Upstash, and Notify.</p>
      </div>
    </main>
  );
}
