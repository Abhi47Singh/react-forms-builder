import React from "react";

export default function ActionToast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-lg z-50 text-lg animate-fade-in">
      {message}
    </div>
  );
}
