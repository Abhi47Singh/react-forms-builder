// SidebarDraggable.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { typeIcons } from "./icons";

export default function SidebarDraggable({ type, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { fromSidebar: true },
  });
  const Icon = typeIcons[type];

  return (
    <div
      className="w-full py-4 px-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-center cursor-grab active:cursor-grabbing dark:text-white mb-2 text-center"
      tabIndex={0}
      role="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ minHeight: 60 }}
    >
      <span className="flex items-center gap-2 justify-center w-full">
        {Icon && <Icon className="inline-block text-lg" />}
        {label}
      </span>
    </div>
  );
}
