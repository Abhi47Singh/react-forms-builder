// ParagraphField.jsx
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  FaPen,
  FaBold,
  FaItalic,
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowsAlt,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

import { FaArrowsUpDown } from "react-icons/fa6";

const MIN_SIZE = 10;
const MAX_SIZE = 50;

export default function ParagraphField({
  field,
  updateField,
  removeField,
  listeners,
  attributes,
  setNodeRef,
  transform,
  transition,
  isDragging,
}) {
  const [showFontInput, setShowFontInput] = useState(false);
  const [fontInput, setFontInput] = useState(field.fontSize || 18);
  const [fontError, setFontError] = useState("");
  const [showMarginInput, setShowMarginInput] = useState(false);
  const [marginInput, setMarginInput] = useState(field.margin || 0);

  // In editing mode, show textarea + save button
  if (field.editing) {
    return (
      <div className="my-2 flex items-center gap-2">
        <textarea
          value={field.text}
          onChange={(e) => updateField(field.id, { text: e.target.value })}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
          rows={2}
        />
        <button
          className="ml-2 text-green-600"
          title="Save"
          onClick={() => updateField(field.id, { editing: false })}
          type="button"
        >
          Save
        </button>
      </div>
    );
  }

  const fontSize = field.fontSize || 18;
  const margin = field.margin || 0;
  const align = field.align || "left";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        marginTop: margin,
        marginBottom: margin,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
        boxShadow: isDragging
          ? "0 0 0 2px #2563eb, 0 8px 24px 0 rgba(0,0,0,0.12)"
          : undefined,
        border: isDragging ? "2px solid #2563eb" : undefined,
      }}
      className={`my-2 flex items-center gap-2 rounded-md ${
        isDragging ? "bg-blue-900/30" : "border border-transparent"
      }`}
    >
      {/* Drag handle */}
      <span
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="cursor-move mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 select-none"
        title="Drag to reorder"
        tabIndex={-1}
        style={{ fontSize: 20 }}
      >
        <FaArrowsAlt />
      </span>

      {/* Styled paragraph text */}
      <span
        style={{
          fontWeight: field.bold ? "bold" : "normal",
          fontStyle: field.italic ? "italic" : "normal",
          fontSize,
          textAlign: align,
          width: "100%",
          display: "block",
          marginTop: Number(margin) || 0,
          marginBottom: Number(margin) || 0,
        }}
      >
        {field.text}
      </span>

      {/* Formatting controls */}
      <div className="flex items-center gap-1 border border-gray-400 dark:border-gray-600 rounded px-2 py-1 bg-gray-100 dark:bg-gray-900">
        <button
          title="Edit text"
          onClick={() => updateField(field.id, { editing: true })}
          type="button"
        >
          <FaPen />
        </button>
        <button
          title="Bold"
          className={`px-1 rounded ${field.bold ? "bg-blue-500 text-white" : ""}`}
          onClick={() => updateField(field.id, { bold: !field.bold })}
          type="button"
        >
          <FaBold />
        </button>
        <button
          title="Italic"
          className={`px-1 rounded ${field.italic ? "bg-blue-500 text-white" : ""}`}
          onClick={() => updateField(field.id, { italic: !field.italic })}
          type="button"
        >
          <FaItalic />
        </button>

        {/* Alignment controls */}
        <button
          title="Align left"
          className={`px-2 py-1 rounded ${align === "left" ? "bg-blue-500 text-white" : ""}`}
          onClick={() => updateField(field.id, { align: "left" })}
          type="button"
        >
          <FaAlignLeft />
        </button>
        <button
          title="Align center"
          className={`px-2 py-1 rounded ${align === "center" ? "bg-blue-500 text-white" : ""}`}
          onClick={() => updateField(field.id, { align: "center" })}
          type="button"
        >
          <FaAlignCenter />
        </button>
        <button
          title="Align right"
          className={`px-2 py-1 rounded ${align === "right" ? "bg-blue-500 text-white" : ""}`}
          onClick={() => updateField(field.id, { align: "right" })}
          type="button"
        >
          <FaAlignRight />
        </button>

        {/* Margin control - moved here */}
        <button
          title="Set margin"
          className={`px-1 rounded ${showMarginInput ? "bg-blue-500 text-white" : ""}`}
          onClick={() => {
            setMarginInput(margin);
            setShowMarginInput((v) => !v);
          }}
          type="button"
        >
          <FaArrowsUpDown />
        </button>
        {showMarginInput && (
          <input
            type="number"
            value={marginInput}
            min={-100}
            max={100}
            step={1}
            onChange={e => {
              setMarginInput(e.target.value);
              updateField(field.id, { margin: Number(e.target.value) }); // Real-time update
            }}
            onBlur={() => setShowMarginInput(false)}
            className="w-14 px-1 mx-1 text-xs border rounded text-black"
            style={{ transition: "all 0.2s" }}
            autoFocus
          />
        )}

        {/* Font size control */}
        {showFontInput ? (
          <input
            type="number"
            value={fontInput}
            min={MIN_SIZE}
            max={MAX_SIZE}
            onChange={(e) => setFontInput(e.target.value)}
            onBlur={() => {
              const val = parseInt(fontInput, 10);
              if (isNaN(val) || val < MIN_SIZE || val > MAX_SIZE) {
                setFontError(
                  `Font size must be between ${MIN_SIZE}px and ${MAX_SIZE}px`
                );
                setTimeout(() => setFontError(""), 2000);
              } else {
                updateField(field.id, { fontSize: val });
                setShowFontInput(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") e.target.blur();
            }}
            className="w-12 px-1 mx-1 text-xs border rounded text-black"
            autoFocus
          />
        ) : (
          <span
            title="Click to set custom font size"
            className="mx-1 text-xs cursor-pointer underline"
            onClick={() => {
              setFontInput(fontSize);
              setShowFontInput(true);
            }}
          >
            {fontSize}px
          </span>
        )}

        <button
          title="Delete"
          className="ml-2 text-red-600"
          onClick={() => removeField(field.id)}
          type="button"
        >
          <FaTrash />
        </button>
        {fontError && (
          <span className="ml-2 text-xs text-red-500 animate-pulse">
            {fontError}
          </span>
        )}
      </div>
    </div>
  );
}
