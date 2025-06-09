import React from "react";
import { FaEye, FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function FormActionBtn({
  onPreview,
  onShare,
  onUndo,
  onRedo,
  onClear,
}) {
  return (
    <div className="flex justify-center gap-4 -mt-4">
      <button
        className="group lg:text-sm text-xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow px-3 py-2 xs500:flex items-center gap-2 text-black dark:text-white hidden outline-none focus:outline-none active:bg-gray-200 dark:active:bg-gray-700"
        onClick={onPreview}
        type="button"
        tabIndex={-1}
      >
        <FaEye />
        <span className="hidden lg:inline">Preview</span>
      </button>
      <button
        className="group lg:text-sm text-lgs bg-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded shadow px-3 py-2 xs500:flex items-center gap-2 text-black dark:text-white hidden outline-none focus:outline-none active:bg-gray-200 dark:active:bg-gray-700"
        onClick={onShare}
        type="button"
        tabIndex={-1}
      >
        <IoShareSocial />
        <span className="hidden lg:inline">Share Form</span>
      </button>
      <button
        onClick={onUndo}
        className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-green-500 hover:text-white transition outline-none focus:outline-none active:bg-gray-200 dark:active:bg-gray-700"
        title="Undo"
        type="button"
        tabIndex={-1}
      >
        <FaUndoAlt className="text-lg" />
        <span className="hidden lg:inline">Undo</span>
      </button>
      <button
        onClick={onClear}
        className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-red-500 hover:text-white transition-colors outline-none focus:outline-none active:bg-gray-200 dark:active:bg-gray-700"
        title="Clear All"
        type="button"
        tabIndex={-1}
      >
        <MdOutlineDeleteForever className="text-xl" />
        <span className="hidden lg:inline">Clear All</span>
      </button>
      <button
        onClick={onRedo}
        className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-green-500 hover:text-white transition outline-none focus:outline-none active:bg-gray-200 dark:active:bg-gray-700"
        title="Redo"
        type="button"
        tabIndex={-1}
      >
        <FaRedoAlt className="text-lg" />
        <span className="hidden lg:inline">Redo</span>
      </button>
    </div>
  );
}