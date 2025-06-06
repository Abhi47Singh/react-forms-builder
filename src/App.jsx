// App.jsx
import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import Sidebar from "./components/Sidebar";
import FormBuilder from "./components/FormBuilder";
import PreviewModal from "./components/PreviewModal";
import useUndoRedo from "./hooks/useUndoRedo";
import SortableField from "./components/SortableField"; // or your field preview component
import { typeIcons } from "./components/icons"; // for icon previews

const COMPONENTS = [
  { type: "name", label: "Name" },
  { type: "email", label: "Email" },
  { type: "phone", label: "Phone" },
  { type: "address", label: "Address" },
  { type: "date", label: "Date" },
  { type: "dropdown", label: "Dropdown" },
  { type: "radio", label: "Radio" },
  { type: "textarea", label: "Textarea" },
  { type: "p", label: "Add Text" },
  { type: "hr", label: "Separator Line" },
  { type: "file", label: "File Upload" },
  { type: "submit", label: "Submit Button" },
];

export default function App() {
  // Restore fields from localStorage if available
  const [fields, setFields, undoAction, redoAction, clearAll] = useUndoRedo(
    (() => {
      const saved = localStorage.getItem("hypergo_builder_fields");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback to empty if corrupted
        }
      }
      return [];
    })(),
    10
  );
  const [preview, setPreview] = useState(false);
  const [theme, setTheme] = useState("light");
  const [config, setConfig] = useState(null);

  // NEW: flag to know if a true drag started from sidebar
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const [draggedSidebarType, setDraggedSidebarType] = useState(null);

  // Persist theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  // Persist fields
  useEffect(() => {
    localStorage.setItem("hypergo_builder_fields", JSON.stringify(fields));
  }, [fields]);

  // Load form from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("form")) {
      try {
        const decoded = atob(decodeURIComponent(params.get("form")));
        const loadedFields = JSON.parse(decoded);
        setFields(loadedFields);
      } catch (e) {
        alert("Invalid form link!");
      }
    }
  }, []);

  // Share form handler
  const handleShare = () => {
    const json = JSON.stringify(fields);
    const encoded = encodeURIComponent(btoa(json));
    const shareUrl = `${window.location.origin}${window.location.pathname}?form=${encoded}`;
    window.prompt("Copy and share this link:", shareUrl);
  };

  // Use delay so that quick clicks never start a drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 }, // Only drag after moving 10px
    })
  );

  // Called when any drag starts
  const handleDragStart = ({ active }) => {
    if (active.data?.current?.fromSidebar) {
      setIsSidebarDragging(true);
      setDraggedSidebarType(active.id.replace("sidebar-", "")); // Track type for overlay
    }
  };

  // Called when drag finishes (either drop or cancel)
  const handleDragEnd = ({ active, over }) => {
    setDraggedSidebarType(null); // Clear overlay
    if (
      isSidebarDragging &&
      active.data?.current?.fromSidebar
    ) {
      const comp = COMPONENTS.find(
        (c) => c.type === active.id.replace("sidebar-", "")
      );
      if (comp) {
        addField({
          ...comp,
          label: comp.label,
          width: 100,
          options:
            comp.type === "dropdown" || comp.type === "radio"
              ? ["Option 1"]
              : undefined,
          value: "",
        });
      }
      setIsSidebarDragging(false);
      return; // <-- Prevents further drop logic
    }

    // Now handle reorder if it was an internal move
    if (!active.data?.current?.fromSidebar && active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex > -1 && newIndex > -1) {
        setFields((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  const handleDragCancel = () => {
    setIsSidebarDragging(false);
    setDraggedSidebarType(null); // Clear overlay
  };

  // Helper to add one or two fields (for name @50%)
  const addField = (cfg) => {
    const count = cfg.type === "name" && cfg.width === 50 ? 2 : 1;
    const newFields = [];
    for (let i = 0; i < count; i++) {
      newFields.push({
        ...cfg,
        id: `${cfg.type}-${Date.now()}-${i}`,
        value: "",
      });
    }
    setFields((prev) => [...prev, ...newFields]);
  };

  // Update/add/remove handlers using setFields
  const updateField = (id, updates) => {
    // If only the 'value' property is being updated, skip undo/redo history
    if (Object.keys(updates).length === 1 && updates.value !== undefined) {
      setFields(
        (prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        { skipHistory: true }
      );
    } else {
      setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    }
  };
  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear all fields and localStorage
  const handleClearAll = () => {
    clearAll();
    setFields([]); // Force fields to empty immediately
    localStorage.removeItem("hypergo_builder_fields");
  };

  // Helper to generate unique IDs for template fields
  function withFreshIds(fields) {
    return fields.map((f, i) => ({
      ...f,
      id: `${f.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
    }));
  }

  const handleUseTemplate = (tpl) => {
    setFields(withFreshIds(tpl.fields));
  };

  return (
    <div
      className={`${theme} h-screen bg-white text-black dark:bg-gray-900 dark:text-white`}
    >
      {/* Theme toggle */}
      <button
        className="absolute top-2 right-8 z-50 text-xl p-2 rounded-full bg-white dark:bg-gray-800 shadow"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        title="Toggle theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>

      {/* Preview modal */}
      {preview && (
        <PreviewModal
          fields={fields}
          setPreview={setPreview}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex h-screen">
          <Sidebar
            onAdd={addField}
            COMPONENTS={COMPONENTS}
            setPreview={setPreview}
            config={config}
            setConfig={setConfig}
            updateField={updateField}
            onUseTemplate={handleUseTemplate} // <-- add this
          />
          <FormBuilder
            fields={fields}
            updateField={updateField}
            removeField={removeField}
            setConfig={setConfig}
            setPreview={setPreview}
            undoAction={undoAction}
            redoAction={redoAction}
            clearAll={handleClearAll}
          />
        </div>
        {/* Drag preview overlay */}
        <DragOverlay>
          {draggedSidebarType ? (
            <div className="p-4 rounded border bg-white dark:bg-gray-800 shadow-lg flex items-center gap-2 min-w-[120px]">
              {typeIcons[draggedSidebarType] && (
                <span className="text-xl">{React.createElement(typeIcons[draggedSidebarType])}</span>
              )}
              <span className="capitalize font-semibold">
                {COMPONENTS.find(c => c.type === draggedSidebarType)?.label || draggedSidebarType}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
