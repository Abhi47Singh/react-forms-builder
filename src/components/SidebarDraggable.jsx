// SidebarDraggable.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FaArrowsAlt } from "react-icons/fa";
import { typeIcons } from "./icons";

export default function SidebarDraggable({ type, label, onClick }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { fromSidebar: true },
  });
  const Icon = typeIcons[type];

  return (
    <div
      className="w-full py-2 px-4 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-between cursor-pointer dark:text-white mb-2"
      tabIndex={0}
      role="button"
      onClick={onClick}
      style={{ minHeight: 60 }}
    >
      <span style={{ flexBasis: "75%", overflow: "hidden", textOverflow: "ellipsis" }} className="flex items-center gap-2">
        {Icon && <Icon className="inline-block text-lg" />}
        {label}
      </span>
      {/* Drag handle area: now 25% width */}
      <span
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="cursor-grab text-2xl text-blue-500 hover:text-blue-700"
        title="Drag to add"
        onClick={e => e.stopPropagation()}
        style={{
          flexBasis: "25%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 40,
          minWidth: 0,
          background: "rgba(0,0,0,0)", // transparent, but area is active
        }}
      >
        <FaArrowsAlt />
      </span>
    </div>
  );
}
