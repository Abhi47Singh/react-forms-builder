// SidebarDraggable.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { typeIcons } from "./icons";

export default function SidebarDraggable({ type, label, onTapAdd }) {
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 840;

  if (!isDesktop) {
    // Mobile: tap to add only
    return (
      <div
        className="w-full py-4 px-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-center dark:text-white mb-2 text-center cursor-pointer"
        tabIndex={0}
        role="button"
        onClick={onTapAdd}
        style={{ minHeight: 60 }}
      >
        <span className="flex items-center gap-2 justify-center w-full">
          {typeIcons[type] && React.createElement(typeIcons[type])}
          {label}
        </span>
      </div>
    );
  }

  // Desktop: drag only
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { fromSidebar: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-full py-4 px-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-center dark:text-white mb-2 text-center cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ minHeight: 60 }}
    >
      <span className="flex items-center gap-2 justify-center w-full">
        {typeIcons[type] &&
          React.createElement(typeIcons[type], {
            className: type === "submit" ? "text-3xl" : "text-xl",
          })}
        {label}
      </span>
    </div>
  );
}
