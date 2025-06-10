import React from "react";

export default function ActionToast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <div
        className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-6 py-3 rounded-2xl shadow-2xl text-base font-semibold flex items-center gap-3 border border-gray-200 dark:border-gray-700 animate-fade-in drop-shadow-lg backdrop-blur-md"
        style={{ minWidth: 180, maxWidth: 320 }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
        {message}
      </div>
    </div>
  );
}
