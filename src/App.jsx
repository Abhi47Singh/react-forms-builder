import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import Sidebar from "./components/SIDEBAR/Sidebar";
import FormBuilder from "./components/FormSection/FormBuilder";
import PreviewModal from "./components/Preview/PreviewModal";
import useUndoRedo from "./hooks/useUndoRedo";
import SortableField from "./components/SIDEBAR/SortableField";
import { typeIcons } from "./utils/icons";
import TEMPLATES from "./data/templates";
import MobileSidebarDrawer from "./components/MobileVersion/MobileSidebarDrawer";
import PopUpMobile from "./components/MobileVersion/PopUpMobile";

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
  const [tab, setTab] = useState("components");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const [draggedSidebarType, setDraggedSidebarType] = useState(null);
  const [overId, setOverId] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [activeField, setActiveField] = useState(null);
  // Persist theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  // Handle window resize to switch tabs
  // If window is large enough, switch to components tab
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 840 && !tab) {
        setTab("components");
      }
    };
    window.addEventListener("resize", handleResize);
    // Run once on mount in case user loads at large size
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [tab, setTab]);

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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          alert("Share link copied to clipboard!");
        },
        () => {
          window.prompt("Copy and share this link:", shareUrl);
        }
      );
    } else {
      window.prompt("Copy and share this link:", shareUrl);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // or whatever works for you
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = ({ active }) => {
    if (active.data?.current?.fromSidebar) {
      setIsSidebarDragging(true);
      setDraggedSidebarType(active.id.replace("sidebar-", ""));
    } else {
      // Find and set the active field for overlay
      const found = fields.find((f) => f.id === active.id);
      setActiveField(found || null);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setDraggedSidebarType(null);
    setOverId(null);

    if (isSidebarDragging && active.data?.current?.fromSidebar) {
      const comp = COMPONENTS.find(
        (c) => c.type === active.id.replace("sidebar-", "")
      );
      if (comp) {
        let insertAt = fields.length;
        if (over && over.id) {
          const idx = fields.findIndex((f) => f.id === over.id);
          if (idx !== -1) insertAt = idx;
        }
        const newField = {
          ...comp,
          id: `${comp.type}-${Date.now()}`,
          label: comp.label,
          width: 100,
          options:
            comp.type === "dropdown" || comp.type === "radio"
              ? ["Option 1"]
              : undefined,
          value: "",
        };
        setFields((prev) => [
          ...prev.slice(0, insertAt),
          newField,
          ...prev.slice(insertAt),
        ]);
      }
      setIsSidebarDragging(false);
      return;
    }

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
    setDraggedSidebarType(null);
  };

  const addField = (cfg) => {
    setFields((prev) => [...prev, { ...cfg }]);
  };

  const updateField = (id, updates) => {
    if (Object.keys(updates).length === 1 && updates.value !== undefined) {
      setFields(
        (prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        { skipHistory: true }
      );
    } else {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    }
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (config && config.id === id) {
      setConfig(null);
    }
  };

  const handleClearAll = () => {
    clearAll();
    setFields([]);
    localStorage.removeItem("hypergo_builder_fields");
    setConfig(null);
  };

  function withFreshIds(fields) {
    return fields.map((f, i) => ({
      ...f,
      id: `${f.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
    }));
  }

  const handleUseTemplate = (tpl) => {
    setFields(withFreshIds(tpl.fields));
    setDrawerOpen(false);
  };

  // For mobile: open drawer and reset tab to null (menu) or "components"
  const openDrawer = () => {
    setTab(null);
    setDrawerOpen(true);
  };

  return (
    <div
      className={`${theme} h-screen bg-white text-black dark:bg-gray-900 dark:text-white`}
    >
      <PopUpMobile />
      {/* Theme toggle */}
      <button
        className="absolute top-2 right-8 z-50 text-xl p-2 rounded-full bg-white dark:bg-gray-800 shadow"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        title="Toggle theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebarDrawer
        onAddField={addField}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        COMPONENTS={COMPONENTS}
        TEMPLATES={TEMPLATES}
        tab={tab}
        setTab={setTab}
        config={config}
        setConfig={setConfig}
        updateField={updateField}
        onUseTemplate={handleUseTemplate}
        handleShare={handleShare}
        openMobilePreview={() => setMobilePreview(true)}
        openDesktopPreview={() => setPreview(true)}
      />

      {/* Preview modal */}
      {mobilePreview && (
        <PreviewModal
          fields={fields}
          setPreview={() => setMobilePreview(false)}
          theme={theme}
          setTheme={setTheme}
        />
      )}
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
        onDragOver={({ over }) => setOverId(over?.id || null)}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex h-screen">
          <Sidebar
            COMPONENTS={COMPONENTS}
            TEMPLATES={TEMPLATES}
            onAdd={addField}
            setPreview={setPreview}
            config={config}
            setConfig={setConfig}
            updateField={updateField}
            onUseTemplate={handleUseTemplate}
            tab={tab}
            setTab={setTab}
          />
          <FormBuilder
            setFields={setFields}
            config={config}
            fields={fields}
            updateField={updateField}
            removeField={removeField}
            setConfig={setConfig}
            setPreview={setPreview}
            undoAction={undoAction}
            redoAction={redoAction}
            clearAll={handleClearAll}
            overId={overId}
            isSidebarDragging={isSidebarDragging}
            tab={tab}
            setTab={setTab}
            COMPONENTS={COMPONENTS}
            TEMPLATES={TEMPLATES}
            onUseTemplate={handleUseTemplate}
            handleShare={handleShare}
            onAddField={addField}
          />
        </div>
        <DragOverlay>
          {draggedSidebarType ? (
            <div className="p-4 rounded border bg-white dark:bg-gray-800 shadow-lg flex items-center gap-2 min-w-[120px]">
              {typeIcons[draggedSidebarType] && (
                <span className="text-xl">
                  {React.createElement(typeIcons[draggedSidebarType])}
                </span>
              )}
              <span className="capitalize font-semibold">
                {COMPONENTS.find((c) => c.type === draggedSidebarType)?.label ||
                  draggedSidebarType}
              </span>
            </div>
          ) : activeField ? (
            // This is the preview for fields being reordered
            <div className="p-4 rounded border bg-white dark:bg-gray-800 shadow-lg flex items-center gap-2 min-w-[120px] opacity-90">
              {typeIcons[activeField.type] && (
                <span className="text-xl">
                  {React.createElement(typeIcons[activeField.type])}
                </span>
              )}
              <span className="capitalize font-semibold">
                {activeField.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
