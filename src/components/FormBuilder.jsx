import React, { useRef, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FaEye, FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { FaBroom } from "react-icons/fa6";
import SortableField, { SortableFieldGroup } from "./SortableField";
import { IoShareSocial } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";
import MobileSidebarDrawer from "./MobileSidebarDrawer";

export default function FormBuilder({
  config,
  fields,
  updateField,
  removeField,
  setConfig,
  setPreview,
  undoAction,
  redoAction,
  clearAll,
  overId,
  isSidebarDragging,
  COMPONENTS,
  TEMPLATES,
  onUseTemplate,
  tab,
  setTab,
  handleShare,
  openMobilePreview, // <-- add this
  openDesktopPreview, // <-- add this
  onAddField,
}) {
  const { setNodeRef } = useDroppable({ id: "form-dropzone" });
  const dropzoneRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (dropzoneRef.current) {
      dropzoneRef.current.scrollTop = dropzoneRef.current.scrollHeight;
    }
  }, [fields.length]);

  const handleEdit = (field) => {
    setConfig({ ...field });
    if (window.innerWidth < 840) {
      setTab("config");
      setDrawerOpen(true);
    }
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
      if (isSidebarDragging && overId === fields[i].id) {
        rows.push(
          <div
            key="placeholder"
            className="h-16 bg-blue-200 dark:bg-blue-900 border-2 border-blue-400 rounded flex items-center justify-center mb-2 animate-pulse"
          >
            Drop here
          </div>
        );
      }
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
  if (isSidebarDragging && overId === null) {
    rows.push(
      <div
        key="placeholder-end"
        className="h-16 bg-blue-200 dark:bg-blue-900 border-2 border-blue-400 rounded flex items-center justify-center mb-2 animate-pulse"
      >
        Drop here
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col mt-6">
      {/* Mobile menu icon (left corner, only below ms) */}
      <button
        className="absolute top-[-10px] left-8 z-40 ms:hidden"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar"
      >
        <RiMenu2Fill className="text-[28px]" />
      </button>

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        COMPONENTS={COMPONENTS}
        TEMPLATES={TEMPLATES}
        tab={tab}
        setTab={setTab}
        onUseTemplate={onUseTemplate}
        config={config}
        setConfig={setConfig}
        updateField={updateField}
        handleShare={handleShare}
        openMobilePreview={openMobilePreview}
        openDesktopPreview={openDesktopPreview}
        onAddField={onAddField} // <-- add this line
      />

      {/* Action buttons */}
      <div className="flex justify-center gap-4 -mt-4">
        {/* Preview button */}
        <button
          className="group lg:text-sm text-xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow px-3 py-2 xs500:flex items-center gap-2 text-black dark:text-white hidden"
          onClick={() => setPreview(true)}
        >
          <FaEye />
          <span className="hidden lg:inline group-hover:inline">Preview</span>
        </button>

        {/* Share Form button */}
        <button
          className="group lg:text-sm text-lgs bg-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded shadow px-3 py-2 xs500:flex items-center gap-2 text-black dark:text-white hidden"
          onClick={handleShare}
        >
          <IoShareSocial />
          <span className="hidden lg:inline group-hover:inline">
            Share Form
          </span>
        </button>

        {/* Undo button */}
        <button
          onClick={undoAction}
          className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-green-500 hover:text-white transition"
          title="Undo"
        >
          <FaUndoAlt className="text-lg" />
          <span className="hidden lg:inline group-hover:inline">Undo</span>
        </button>

        {/* Clear All button */}
        <button
          onClick={clearAll}
          className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-red-500 hover:!text-white transition-colors"
          title="Clear All"
        >
          <FaBroom className="text-lg" />
          <span className="hidden lg:inline group-hover:inline">Clear All</span>
        </button>

        {/* Redo button */}
        <button
          onClick={redoAction}
          className="group flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:!bg-green-500 hover:text-white transition"
          title="Redo"
        >
          <FaRedoAlt className="text-lg" />
          <span className="hidden lg:inline group-hover:inline">Redo</span>
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
          <div className="flex flex-col gap-4 h-full">
            {fields.length === 0 ? (
              <div className="flex flex-1 items-center justify-center h-full w-full text-gray-400 text-2xl select-none">
                Drop to add fields
              </div>
            ) : (
              rows
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
