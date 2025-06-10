import React, { useEffect, useState } from "react";
import { FaArrowsAlt, FaPen } from "react-icons/fa";
import { TiFlowSwitch } from "react-icons/ti";
import { typeIcons } from "./utils/icons";

export default function ({
  field,
  onEdit,
  listeners,
  attributes,
  onStartSwitch,
}) {
  const Icon = typeIcons[field.type];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 840);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 840);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mb-2 flex items-center justify-evenly relative w-full">
      {isMobile ? (
        <button
          type="button"
          className="text-3xl text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onStartSwitch && onStartSwitch(field.id);
          }}
          aria-label="Switch position"
        >
          <TiFlowSwitch />
        </button>
      ) : (
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
      )}
      <h4 className="font-semibold text-black dark:text-white flex items-center gap-2 m-0">
        {Icon &&
          (field.type === "file" || field.type === "submit" ? (
            <Icon className="text-2xl hidden xxs:inline-block" />
          ) : (
            <Icon className="text-lg hidden xxs:inline-block" />
          ))}
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
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
