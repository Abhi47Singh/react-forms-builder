import React from "react";
import { FaArrowsAlt, FaPen } from "react-icons/fa";
import { typeIcons } from "./icons";

export default function ({
  field,
  onEdit,
  listeners,
  attributes,
}) {
  const Icon = typeIcons[field.type];

  return (
    <div className="mb-2 flex items-center justify-evenly relative w-full">
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none"
        title="Drag to reorder"
        tabIndex={-1}
        style={{ fontSize: 20, display: "flex", alignItems: "center" }}
      >
        <FaArrowsAlt />
      </span>
      <h4 className="font-semibold text-black dark:text-white flex items-center gap-2 m-0">
        {Icon && <Icon className="inline-block text-lg" />}
        {field.label}
      </h4>
      <button
        onClick={() => onEdit(field)}
        className="text-blue-600 hover:text-blue-800"
        type="button"
        title="Edit"
      >
        <FaPen />
      </button>
    </div>
  );
}
