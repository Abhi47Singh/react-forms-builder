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
import { IoIosSwitch } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import FormActionBtn from "./FormActionBtn";
import SwitchModeControls from "./SwitchModeControls";

export default function FormBuilder({
  config,
  fields,
  updateField,
  removeField,
  setFields,
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
  openMobilePreview,
  openDesktopPreview,
  onAddField,
}) {
  const { setNodeRef } = useDroppable({ id: "form-dropzone" });
  const dropzoneRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switchMode, setSwitchMode] = useState(false);
  const [switchSource, setSwitchSource] = useState(null);
  const [switchTarget, setSwitchTarget] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 840);

  // --- Toast for actions ---
  const [actionToast, setActionToast] = useState(null);
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => setActionToast(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  useEffect(() => {
    if (dropzoneRef.current) {
      dropzoneRef.current.scrollTop = dropzoneRef.current.scrollHeight;
    }
  }, [fields.length]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 840);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (field) => {
    setConfig({ ...field });
    if (window.innerWidth < 840) {
      setTab("config");
      setDrawerOpen(true);
    }
  };

  // Start switch mode
  const onStartSwitch = (id) => {
    if (!isMobile) return;
    setSwitchMode(true);
    setSwitchSource(id);
    setShowToast(true);
    setSwitchTarget(null);
  };

  // Select target field
  const onSelectTarget = (id) => {
    if (switchMode && switchSource && id !== switchSource) {
      setSwitchTarget(id);
      setShowToast(false);
    }
  };

  // Actually switch fields
  const onSwitchFields = () => {
    if (switchSource && switchTarget) {
      const idx1 = fields.findIndex((f) => f.id === switchSource);
      const idx2 = fields.findIndex((f) => f.id === switchTarget);
      if (idx1 > -1 && idx2 > -1) {
        const newFields = [...fields];
        [newFields[idx1], newFields[idx2]] = [newFields[idx2], newFields[idx1]];
        if (typeof setFields === "function") {
          setFields(newFields);
        }
      }
      setSwitchMode(false);
      setSwitchSource(null);
      setSwitchTarget(null);
      setShowToast(false);
    }
  };

  // Abort mission
  const onAbortSwitch = () => {
    setSwitchMode(false);
    setSwitchSource(null);
    setSwitchTarget(null);
    setShowToast(false);
  };

  // --- Action handlers with toast ---
  const handleUndo = () => {
    undoAction();
    setActionToast("Undo used");
  };
  const handleRedo = () => {
    redoAction();
    setActionToast("Redo used");
  };
  const handleClear = () => {
    clearAll();
    setActionToast("Clear all used");
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
          onStartSwitch={onStartSwitch}
          isSwitching={switchMode}
          isMobile={isMobile}
          onSelectTarget={onSelectTarget}
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
        onClick={() => {
          setTab(null); // Always show main menu
          setDrawerOpen(true);
        }}
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
        onAddField={onAddField}
      />

      {/* Action buttons */}
      <FormActionBtn
        onPreview={() => setPreview(true)}
        onShare={handleShare}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
      />

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
        {isMobile ? (
          <div className="flex flex-col gap-4 h-full">
            {fields.length === 0 ? (
              <div className="flex flex-1 items-center justify-center h-full w-full text-gray-400 text-2xl select-none">
                Tap to add fields
              </div>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  className={`
            relative
            ${
              switchMode && field.id === switchSource
                ? "ring-4 ring-blue-400"
                : ""
            }
            ${
              switchMode && switchTarget && field.id === switchTarget
                ? "ring-4 ring-green-400"
                : ""
            }
            ${
              switchMode &&
              field.id !== switchSource &&
              (!switchTarget || field.id !== switchTarget)
                ? "brightness-50"
                : ""
            }
            transition-all
          `}
                  onClick={() => {
                    if (
                      switchMode &&
                      !switchTarget &&
                      field.id !== switchSource
                    ) {
                      onSelectTarget(field.id);
                    }
                  }}
                >
                  <SortableField
                    field={field}
                    updateField={updateField}
                    removeField={removeField}
                    onEdit={handleEdit}
                    onStartSwitch={onStartSwitch}
                    switchMode={switchMode}
                    switchSource={switchSource}
                    switchTarget={switchTarget}
                    isMobile={isMobile}
                    onSelectTarget={onSelectTarget}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
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
        )}
      </div>

      {/* Toast and switch buttons for field switching */}
      {switchMode && showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow z-50">
          Select field to switch places
        </div>
      )}
      {switchMode && switchTarget && (
        <button
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold z-50 flex items-center gap-2"
          onClick={onSwitchFields}
        >
          <IoIosSwitch className="text-2xl" />
          Switch
        </button>
      )}
      {switchMode && (
        <button
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold z-50"
          onClick={onAbortSwitch}
        >
          Cancel
        </button>
      )}

      {/* Action Toast */}
      {actionToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-lg z-50 text-lg animate-fade-in">
          {actionToast}
        </div>
      )}
    </div>
  );
}
