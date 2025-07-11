import React from "react";
import SidebarDraggable from "./SidebarDraggable";
import SidebarTemplates from "./SidebarTemplates";
import FieldConfigForm from "../../FieldConfigForm";
import { FaFileAlt } from "react-icons/fa";

export default function Sidebar({
  COMPONENTS,
  TEMPLATES,
  setPreview,
  config,
  setConfig,
  updateField,
  onUseTemplate,
  tab, // <-- Use tab from props
  setTab, // <-- Use setTab from props
}) {
  const handleTapAdd = (comp) => {
    setConfig({
      ...comp,
      id: undefined, // Let config form know it's a new field
      label: comp.label,
      width: 100,
      options:
        comp.type === "dropdown" || comp.type === "radio"
          ? ["Option 1"]
          : undefined,
      value: "",
    });
    setTab("config");
  };

  return (
    <div className="hidden ms:block w-1/3 p-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white overflow-auto relative">
      {/* Tab Switcher */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 font-bold rounded-l ${
            tab === "components"
              ? "bg-white dark:bg-gray-700"
              : "bg-gray-200 dark:bg-gray-900"
          }`}
          onClick={() => setTab("components")}
        >
          Components
        </button>
        <button
          className={`flex-1 py-2 font-bold rounded-r ${
            tab === "templates"
              ? "bg-white dark:bg-gray-700"
              : "bg-gray-200 dark:bg-gray-900"
          }`}
          onClick={() => setTab("templates")}
        >
          Templates
        </button>
      </div>
      {!config ? (
        <>
          {tab === "components" && (
            <div className="grid grid-cols-2 gap-2">
              {COMPONENTS.map((comp) => (
                <SidebarDraggable
                  key={comp.type}
                  type={comp.type}
                  label={comp.label}
                  onTapAdd={() => handleTapAdd(comp)}
                />
              ))}
            </div>
          )}
          {tab === "templates" && (
            <SidebarTemplates
              templates={TEMPLATES}
              onUseTemplate={onUseTemplate}
            />
          )}
        </>
      ) : (
        <FieldConfigForm
          config={config}
          setConfig={setConfig}
          updateField={updateField}
          onCancel={() => setConfig(null)}
        />
      )}
    </div>
  );
}
