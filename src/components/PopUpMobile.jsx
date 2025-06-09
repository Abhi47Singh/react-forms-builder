import React, { useEffect, useState } from "react";

export default function PopUpMobile() {
  const [show, setShow] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed
    const dismissed = localStorage.getItem("hideMobileFeatureWarning");
    if (!dismissed && window.innerWidth < 840) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    if (dontShow) {
      localStorage.setItem("hideMobileFeatureWarning", "1");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-xs w-full text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-4 text-lg font-semibold text-red-600">
          Some features are not available on mobile.
        </div>
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-base">
          For the full experience, please use a PC or larger screen.
        </div>
        <label className="flex items-center justify-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={e => setDontShow(e.target.checked)}
          />
          Don&apos;t show again
        </label>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}