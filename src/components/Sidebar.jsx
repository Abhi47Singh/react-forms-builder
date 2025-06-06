import React, { useState } from "react";
import SidebarDraggable from "./SidebarDraggable";
import SidebarTemplates from "./SidebarTemplates";
import FieldConfigForm from "./FieldConfigForm";
import { FaFileAlt } from "react-icons/fa";

const TEMPLATES = [
  {
    name: "Contact Form",
    fields: [
      { type: "name", label: "Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      { type: "textarea", label: "Message", width: 100, value: "" },
      { type: "submit", label: "Submit", width: 100, value: "" },
    ],
  },
  {
    name: "Job Application",
    fields: [
      { type: "name", label: "Full Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      { type: "file", label: "Resume", width: 100, value: "" },
      { type: "textarea", label: "Cover Letter", width: 100, value: "" },
      { type: "submit", label: "Apply", width: 100, value: "" },
    ],
  },
  {
    name: "Event Registration",
    fields: [
      { type: "name", label: "Attendee Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      { type: "dropdown", label: "Session", width: 100, value: "", options: ["Morning", "Afternoon"] },
      { type: "submit", label: "Register", width: 100, value: "" },
    ],
  },
];

export default function Sidebar({
  COMPONENTS,
  setPreview,
  config,
  setConfig,
  updateField,
  onUseTemplate,
}) {
  const [tab, setTab] = useState("components");

  return (
    <div className="w-1/3 p-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white overflow-auto relative">
      {/* Tab Switcher */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 font-bold rounded-l ${tab === "components" ? "bg-white dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-900"}`}
          onClick={() => setTab("components")}
        >
          Components
        </button>
        <button
          className={`flex-1 py-2 font-bold rounded-r ${tab === "templates" ? "bg-white dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-900"}`}
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
                  label={
                    comp.type === "file" ? (
                      <span className="flex items-center gap-2">
                        <FaFileAlt className="text-lg" />
                        {comp.label}
                      </span>
                    ) : (
                      comp.label
                    )
                  }
                />
              ))}
            </div>
          )}
          {tab === "templates" && (
            <SidebarTemplates templates={TEMPLATES} onUseTemplate={onUseTemplate} />
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