"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { ImCheckmark, ImCopy, ImEye, ImSpinner2 } from "react-icons/im";

export default function Home() {
  const [message, setMessage] = useState("");
  const [expirationType, setExpirationType] = useState("one-time");
  const [expirationValue, setExpirationValue] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          expirationType,
          expirationValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create message");
      }

      setMessageId(data.messageId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLink = messageId
    ? `${window.location.origin}/read/${messageId}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(messageLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className="flex min-h-screen max-w-5xl flex-col items-center justify-center p-4 md:p-24 mx-auto">
      {/* logo and branding */}
      <Logo />

      <div className="w-full bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 shadow-xl">
        {!messageId ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Secret Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-black/50 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out min-h-32"
                placeholder="Type your secret message here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="expirationType"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Expiration Type
                </label>

                <div className="relative">
                  <select
                    id="expirationType"
                    value={expirationType}
                    onChange={(e) => setExpirationType(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-black/50 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  >
                    <option value="one-time">One-time view</option>
                    <option value="time-based">Time-based expiry</option>
                  </select>
                  <FaChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {expirationType === "time-based" && (
                <div>
                  <label
                    htmlFor="expirationValue"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Expiration Time
                  </label>
                  <div className="relative">
                    <select
                      id="expirationValue"
                      value={expirationValue}
                      onChange={(e) => setExpirationValue(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-black/50 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    >
                      <option value="10">10 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="1440">24 hours</option>
                    </select>
                    <FaChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden group w-full py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
              {isSubmitting ? (
                <span className="flex items-center justify-center relative z-10">
                  <ImSpinner2 className="animate-spin mr-2" />
                  Creating...
                </span>
              ) : (
                <span className="relative z-10">Create Secret Message</span>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-black/50 border border-green-200 dark:border-green-800 rounded-lg gap-4 flex flex-col">
              <div className="flex items-center mb-2 gap-2">
                <ImCheckmark className="size-4 text-green-500" />
                <h3 className="text-green-500 font-bold">
                  Secret message created!
                </h3>
              </div>
              <p className="text-sm text-white">
                Share this link with the recipient. The message will be
                destroyed after reading
                {expirationType === "time-based" &&
                  ` or after ${expirationValue} minutes`}.
              </p>

              <p className="text-sm font-mono p-4 bg-black/50 rounded-lg border border-white/10 text-white">
                {messageLink}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCopy}
                className="relative overflow-hidden group flex-1 py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
                {copySuccess ? (
                  <>
                    <ImCheckmark className="size-4 mr-2 text-green-500 relative z-10" />
                    <span className="relative z-10">Copied!</span>
                  </>
                ) : (
                  <>
                    <ImCopy className="size-4 mr-2 relative z-10" />
                    <span className="relative z-10">Copy Link</span>
                  </>
                )}
              </button>
              <Link
                href={`/read/${messageId}`}
                className="relative overflow-hidden group flex-1 py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
                <ImEye className="size-4 mr-2 relative z-10" />
                <span className="relative z-10">View Message</span>
              </Link>
            </div>

            <button
              onClick={() => setMessageId(null)}
              className="relative overflow-hidden group w-full py-3 px-4 bg-black/80 hover:bg-black text-white font-medium rounded-lg border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
              <span className="relative z-10">Create Another Message</span>
            </button>
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
