import React, { useRef, useEffect, useState } from "react";
import { FaPlus, FaMinus, FaAsterisk } from "react-icons/fa";

export default function FieldConfigForm({
  config,
  setConfig,
  updateField,
  onAddField,
  onCancel,
}) {
  const labelInputRef = useRef(null);
  const prevConfigType = useRef();
  const [localValue, setLocalValue] = useState(config.placeholder || "");
  const [error, setError] = useState("");

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

  // Live validation for placeholder (example input)
  useEffect(() => {
    let err = "";
    if (config.type === "email" && localValue) {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(localValue)) {
        err = "Please enter a valid email address (e.g. name123@gmail.com)";
      }
    }
    if (config.type === "number" && localValue) {
      if (!/^\d+$/.test(localValue)) {
        err = "Only numbers are allowed (e.g. 12345)";
      }
    }
    setError(err);
  }, [localValue, config.type]);

  const handleSave = () => {
    if (!config.id && typeof onAddField === "function") {
      onAddField({
        ...config,
        id: `${config.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      });
    } else if (config.id && typeof updateField === "function") {
      updateField(config.id, config);
    }
    setConfig(null);
    onCancel();
  };

  // Helper for options
  const handleOptionChange = (idx, value) => {
    setConfig({
      ...config,
      options: config.options.map((opt, i) => (i === idx ? value : opt)),
    });
  };
  const handleAddOption = () => {
    setConfig({
      ...config,
      options: [...(config.options || []), ""],
    });
  };
  const handleRemoveOption = (idx) => {
    setConfig({
      ...config,
      options: config.options.filter((_, i) => i !== idx),
    });
  };

  return (
    <form className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl">Configure {config.type}</h3>
        {/* REMOVE the top-right cancel button */}
        {/* <button onClick={onCancel} className="text-black dark:text-white">
          <FaTimes />
        </button> */}
      </div>

      {/* Options for dropdown/radio */}
      {(config.type === "dropdown" || config.type === "radio") && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Options</label>
          {(config.options || []).map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                className="flex-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveOption(idx)}
                disabled={config.options.length <= 1}
              >
                <FaMinus />
              </button>
              {idx === config.options.length - 1 && (
                <button
                  type="button"
                  className="text-green-500"
                  onClick={handleAddOption}
                >
                  <FaPlus />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Label */}
      {config.type !== "hr" && config.type !== "p" && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Label</label>
          <input
            ref={labelInputRef}
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
            value={config.label || ""}
            onChange={(e) => setConfig({ ...config, label: e.target.value })}
            placeholder="Field label"
          />
        </div>
      )}

      {/* Placeholder with live validation */}
      {config.type !== "hr" &&
        config.type !== "p" &&
        config.type !== "submit" && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Example Value</label>
            <input
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder={
                config.type === "email"
                  ? "name123@gmail.com"
                  : config.type === "number"
                  ? "12345"
                  : "Placeholder text"
              }
            />
            {config.type === "email" && (
              <div className="text-xs text-gray-400 mt-1">
                Example: <span className="font-mono">name123@gmail.com</span>
              </div>
            )}
            {config.type === "number" && (
              <div className="text-xs text-gray-400 mt-1">
                Example: <span className="font-mono">12345</span>
              </div>
            )}
            {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
          </div>
        )}

      {/* Required */}
      {config.type !== "hr" && config.type !== "p" && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!config.required}
            onChange={(e) =>
              setConfig({ ...config, required: e.target.checked })
            }
            id="required"
          />
          <label htmlFor="required" className="flex items-center gap-1">
            <FaAsterisk className="text-red-500 text-xs" /> Required
          </label>
        </div>
      )}

      {/* Width for submit button */}
      {config.type === "submit" && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Width</label>
          <div className="flex gap-2">
            {[100, 50].map((val) => (
              <button
                key={val}
                type="button"
                className={`px-4 py-2 rounded border ${
                  config.width === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                }`}
                onClick={() => setConfig({ ...config, width: val })}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Radio specific settings */}
      {config.type === "radio" && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!config.multi}
            onChange={(e) => setConfig({ ...config, multi: e.target.checked })}
            id="multi"
          />
          <label htmlFor="multi" className="flex items-center gap-1">
            Allow multiple selection
          </label>
        </div>
      )}

      {/* HR (line) specific settings */}
      {config.type === "hr" && (
        <div className="mb-4 space-y-4">
          {/* Thickness */}
          <div>
            <label className="block mb-2 font-semibold">Thickness (px)</label>
            <div className="flex gap-2">
              {[1, 3, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`px-4 py-2 rounded border ${
                    config.thickness === val
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() => setConfig({ ...config, thickness: val })}
                >
                  {val}px
                </button>
              ))}
            </div>
          </div>
          {/* Bold */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!config.bold}
              onChange={(e) => setConfig({ ...config, bold: e.target.checked })}
              id="bold"
            />
            <label htmlFor="bold" className="flex items-center gap-1">
              Bold
            </label>
          </div>
          {/* Style */}
          <div>
            <label className="block mb-2 font-semibold">Line Style</label>
            <select
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              value={config.style || "solid"}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
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

      {/* Place the buttons here */}
      <div className="flex xs500:flex-row flex-col gap-4 mt-6">
        <button
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex-1"
          onClick={handleSave}
          type="button"
        >
          {config.id ? "Save" : "Add to Form"}
        </button>
        <button
          className="bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold flex-1"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
