import React from "react";
import { IoClose } from "react-icons/io5";

export default function MobileSidebarDrawer({
  open,
  onClose,
  onSelect,
}) {
  const menuOptions = [
    { label: "Components", value: "components" },
    { label: "Templates", value: "templates" },
    { label: "Preview", value: "preview" },
    { label: "Share Form", value: "share" },
  ];

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black/40 backdrop-blur-md ms:hidden
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className={`
          fixed top-0 left-0 h-full
          bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-lg
          transition-transform duration-300 ease-in
          ${open ? "translate-x-0" : "-translate-x-[85vw]"}
        `}
        style={{
          width: "85vw",
          maxWidth: "none",
        }}
      >
        {/* Top Bar with only X */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-red-500"
          >
            <IoClose />
          </button>
        </div>
        {/* Centered Menu Options with Stagger Animation */}
        <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-8">
          {menuOptions.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => onSelect && onSelect(opt.value)}
              className={`
                text-2xl font-semibold w-3/4 py-4 rounded-lg
                hover:bg-gray-200 dark:hover:bg-gray-700
                hover:underline hover:text-blue-600 dark:hover:text-blue-400
                transition-all duration-300
                ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{
                transitionDelay: open
                  ? `${i * 120 + 100}ms`
                  : `${(menuOptions.length - i) * 80}ms`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />
    </div>
  );
}