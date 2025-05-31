import React, { useRef, useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTimes, FaAsterisk, FaFileAlt } from "react-icons/fa";
import SidebarDraggable from "./SidebarDraggable";

// Example templates
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
  onAdd,
  COMPONENTS,
  setPreview,
  config,
  setConfig,
  updateField,
  onUseTemplate,
}) {
  const [tab, setTab] = useState("components");
  const labelInputRef = useRef(null);
  const prevConfigType = useRef();

  useEffect(() => {
    if (
      config &&
      config.type !== "p" &&
      labelInputRef.current &&
      config.type !== prevConfigType.current
    ) {
      labelInputRef.current.focus();
    }
    prevConfigType.current = config ? config.type : undefined;
  }, [config]);

  const startConfig = (type) => {
    setConfig({ type, label: "", width: 100, options: ["Option 1"] });
  };

  const cancelConfig = () => setConfig(null);

  const handleSave = () => {
    if (config.id) {
      updateField(config.id, config);
    } else {
      onAdd({
        ...config,
        placeholder: config.placeholder || config.label,
      });
    }
    setConfig(null);
  };

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
                  icon={comp.icon}
                  onClick={() => startConfig(comp.type)}
                />
              ))}
            </div>
          )}
          {tab === "templates" && (
            <div>
              {TEMPLATES.map((tpl) => (
                <div key={tpl.name} className="mb-4 p-2 bg-white dark:bg-gray-700 rounded shadow">
                  <div className="font-semibold mb-1">{tpl.name}</div>
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() => onUseTemplate(tpl)}
                  >
                    Use this form
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">Configure {config.type}</h3>
            <button onClick={cancelConfig} className="text-black dark:text-white">
              <FaTimes />
            </button>
          </div>
          {config.type === "name" && (
            <div className="mb-4">
              <label className="block mb-1">Width %</label>
              <div className="flex space-x-2">
                {[100, 50].map((w) => (
                  <button
                    key={w}
                    onClick={() => setConfig((c) => ({ ...c, width: w }))}
                    className={`px-3 py-1 border rounded ${
                      config.width === w
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {w}%
                  </button>
                ))}
              </div>
            </div>
          )}
          {(config.type === "dropdown" || config.type === "radio") && (
            <div className="mb-4">
              <label className="block mb-1">Options</label>
              {config.options.map((opt, i) => (
                <div key={i} className="flex items-center mb-2">
                  <input
                    className="flex-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...config.options];
                      opts[i] = e.target.value;
                      setConfig((c) => ({ ...c, options: opts }));
                    }}
                  />
                  <button
                    onClick={() =>
                      setConfig((c) => ({
                        ...c,
                        options: c.options.filter((_, j) => j !== i),
                      }))
                    }
                    className="ml-2 text-red-500 dark:text-red-400"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => {
                      const opts = [...config.options];
                      opts.splice(i + 1, 0, "");
                      setConfig((c) => ({ ...c, options: opts }));
                    }}
                    className="ml-1 text-green-500 dark:text-green-400"
                  >
                    <FaPlus className="mr-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {config.type === "submit" && (
            <div className="mb-4">
              <label className="block mb-1">Button Text</label>
              <input
                value={config.label}
                onChange={e =>
                  setConfig((c) => ({ ...c, label: e.target.value }))
                }
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
              />
              <label className="block mb-1 mt-2">Width %</label>
              <div className="flex space-x-2">
                {[100, 50].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, width: w }))}
                    className={`px-3 py-1 border rounded ${
                      config.width === w
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {w}%
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Label for all fields */}
          {config.type !== "p" && config.type !== "submit" && (
            <div className="mb-4">
              <label className="block mb-1">Label</label>
              <input
                ref={labelInputRef}
                value={config.label}
                onChange={e =>
                  setConfig((c) => ({ ...c, label: e.target.value }))
                }
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          {/* Placeholder for all fields */}
          {["name", "email", "phone", "address", "date", "textarea", "file"].includes(config.type) && (
            <div className="mb-4">
              <label className="block mb-1">Placeholder</label>
              <input
                value={config.placeholder || ""}
                onChange={e => setConfig(c => ({ ...c, placeholder: e.target.value }))}
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          {/* Required for all fields except paragraph and submit */}
          {config.type !== "p" && config.type !== "submit" && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id={config.type === "file" ? "file-required" : "required"}
                checked={!!config.required}
                onChange={e => setConfig(c => ({ ...c, required: e.target.checked }))}
                className="accent-blue-500"
              />
              <label htmlFor={config.type === "file" ? "file-required" : "required"} className="select-none flex items-center gap-1">
                <FaAsterisk className="text-xs text-red-500" /> Required
              </label>
            </div>
          )}
          {config.type === "radio" && (
            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="radioMode"
                  checked={!config.multi}
                  onChange={() => setConfig(c => ({ ...c, multi: false }))}
                />
                <span>Single selection</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="radioMode"
                  checked={!!config.multi}
                  onChange={() => setConfig(c => ({ ...c, multi: true }))}
                />
                <span>Multi selection</span>
              </label>
            </div>
          )}
          {config.type === "p" && (
            <div className="mb-4">
              <label className="block mb-1">Text</label>
              <textarea
                value={config.text || ""}
                onChange={e => setConfig(c => ({ ...c, text: e.target.value }))}
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                rows={3}
              />
            </div>
          )}
          {config?.type === "hr" && (
            <div className="space-y-3">
              <div>
                <label className="block mb-1">Thickness</label>
                <div className="flex gap-2">
                  {[1, 3, 5].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, thickness: t }))}
                      className={`px-3 py-1 border rounded ${
                        config.thickness === t
                          ? "bg-blue-500 text-white"
                          : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {t}px
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1">Bold</label>
                <input
                  type="checkbox"
                  checked={!!config.bold}
                  onChange={e => setConfig(c => ({ ...c, bold: e.target.checked }))}
                  className="accent-blue-500"
                  id="hr-bold"
                />
                <label htmlFor="hr-bold" className="ml-2">Bold Line</label>
              </div>
              <div>
                <label className="block mb-1">Style</label>
                <select
                  value={config.style || "solid"}
                  onChange={e => setConfig(c => ({ ...c, style: e.target.value }))}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                  <option value="inset">Inset</option>
                  <option value="outset">Outset</option>
                </select>
              </div>
            </div>
          )}
          <button
            onClick={handleSave}
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            {config.id ? "Save" : "Add to Form"}
          </button>
        </div>
      )}
    </div>
  );
}