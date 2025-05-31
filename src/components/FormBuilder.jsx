import React, { useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FaEye, FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { FaBroom } from "react-icons/fa6";
import SortableField, { SortableFieldGroup } from "./SortableField";
import { IoShareSocial } from "react-icons/io5";

export default function FormBuilder({
  fields,
  updateField,
  removeField,
  setConfig,
  setPreview,
  undoAction,
  redoAction,
  clearAll,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "form-dropzone" });
  const dropzoneRef = useRef(null);

  // Auto-scroll to bottom when fields change
  useEffect(() => {
    if (dropzoneRef.current) {
      dropzoneRef.current.scrollTop = dropzoneRef.current.scrollHeight;
    }
  }, [fields.length]);

  const handleEdit = (field) => {
    setConfig({ ...field }); // Open config with current field data
  };

  const handleShare = () => {
    const json = JSON.stringify(fields);
    const encoded = encodeURIComponent(btoa(json));
    const shareUrl = `${window.location.origin}${window.location.pathname}?form=${encoded}`;
    window.prompt("Copy and share this link:", shareUrl);
  };

  let rows = [];
  for (let i = 0; i < fields.length; ) {
    if (fields[i].width === 50 && fields[i + 1] && fields[i + 1].width === 50) {
      rows.push(
        <SortableFieldGroup
          key={fields[i].id + fields[i + 1].id}
          group={[fields[i], fields[i + 1]]}
          updateField={updateField}
          removeField={removeField}
        />
      );
      i += 2;
    } else {
      rows.push(
        <SortableField
          key={fields[i].id}
          field={fields[i]}
          updateField={updateField}
          removeField={removeField}
          onEdit={handleEdit}
        />
      );
      i += 1;
    }
  }

  return (
    <div className="flex-1 relative flex flex-col mt-6">
      {/* Clear All, Undo, Redo Buttons */}
      <div className="flex justify-center gap-4 -mt-4">
        {/* Undo */}
        <button
          onClick={undoAction}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-green-500 hover:text-white transition"
        >
          <FaUndoAlt className="text-lg" />
        </button>
        {/* Clear All */}
        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-red-500 hover:!text-white transition-colors"
        >
          <FaBroom className="text-lg" />
          Clear All
        </button>
        {/* Redo */}
        <button
          onClick={redoAction}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-green-500 hover:text-white transition"
        >
          <FaRedoAlt className="text-lg" />
        </button>
      </div>

      {/* Main Form Builder */}
      <div
        ref={(node) => {
          setNodeRef(node);
          dropzoneRef.current = node;
        }}
        className="flex-1 p-8 overflow-auto border-2 border-dotted rounded flex flex-col bg-gray-50 dark:bg-gray-900 mx-8 my-8 scrollbar-hide"
        id="form-dropzone"
        style={{ minHeight: 200, maxHeight: "none" }}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {fields.length === 0 ? (
              <div className="w-full flex items-center justify-center h-60">
                <span className="text-gray-400 text-lg text-center">
                  Drag or tap to add field
                </span>
              </div>
            ) : (
              rows
            )}
          </div>
        </SortableContext>
      </div>

      {/* Preview button at the bottom left */}
      <div className="absolute flex justify-center items-center gap-4 ml-8 -mt-4">
        <button
          className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded shadow px-3 py-2 flex items-center gap-2 text-black dark:text-white"
          onClick={() => setPreview(true)}
        >
          <FaEye />
          Preview
        </button>

        <button
          className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded shadow px-3 py-2 flex items-center gap-2 text-black dark:text-white"
          onClick={handleShare}
        >
          <IoShareSocial />
          Share Form
        </button>
      </div>
    </div>
  );
}
