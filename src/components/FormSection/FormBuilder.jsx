import React, { useRef, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import MobileSidebarDrawer from "../MobileVersion/MobileSidebarDrawer";
import FormActionBtn from "./FormActionBtn";
import SwitchModeControls from "./SwitchModeControls";
import ActionToast from "./ActionToast";
import FieldList from "./FieldList";

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

  return (
    <div className="flex-1 relative flex flex-col mt-6">
      {/* Mobile menu icon (left corner, only below ms) */}
      <button
        className="absolute top-[-20px] left-8 z-40 ms:hidden"
        onClick={() => {
          setTab(null); // Always show main menu
          setDrawerOpen(true);
        }}
        aria-label="Open sidebar"
      >
        <span className="text-[28px]">&#9776;</span>
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
        onClick={() => {
          if (isMobile && fields.length === 0) {
            setTab(null); // Show main menu
            setDrawerOpen(true);
          }
        }}
      >
        <FieldList
          fields={fields}
          updateField={updateField}
          removeField={removeField}
          handleEdit={handleEdit}
          onStartSwitch={onStartSwitch}
          isSidebarDragging={isSidebarDragging}
          overId={overId}
          isMobile={isMobile}
          switchMode={switchMode}
          switchSource={switchSource}
          switchTarget={switchTarget}
          onSelectTarget={onSelectTarget}
        />
      </div>

      {/* Toast and switch buttons for field switching */}
      <SwitchModeControls
        switchMode={switchMode}
        showToast={showToast}
        switchTarget={switchTarget}
        onSwitchFields={onSwitchFields}
        onAbortSwitch={onAbortSwitch}
      />

      {/* Action Toast */}
      <ActionToast message={actionToast} />
    </div>
  );
}
