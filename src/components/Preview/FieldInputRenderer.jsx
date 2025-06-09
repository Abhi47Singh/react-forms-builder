import React, { useRef, useState } from "react";
import { FaFileAlt } from "react-icons/fa";

export default function FieldInputRenderer({ field, updateField, previewMode }) {
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  if (field.type === "textarea") {
    return (
      <textarea
        className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white"
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  }
  if (field.type === "dropdown") {
    return (
      <select
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        required={field.required}
      >
        {field.options.map((o, i) => (
          <option key={i}>{o}</option>
        ))}
      </select>
    );
  }
  if (field.type === "radio" && field.multi) {
    return (
      <div className="flex gap-10">
        {field.options.map((opt, i) => (
          <label key={i} className="cursor-pointer">
            <input
              type="checkbox"
              checked={field.value && field.value.includes(opt)}
              onChange={() => {
                const newValue = field.value && field.value.includes(opt)
                  ? field.value.filter(v => v !== opt)
                  : [...(field.value || []), opt];
                updateField(field.id, { value: newValue });
              }}
              className="peer hidden"
            />
            <span
              className={`inline-flex items-center justify-center px-4 py-2 border-2 border-gray-400 dark:border-gray-600 rounded-md text-base transition
                peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500
                bg-white dark:bg-gray-800 text-black dark:text-white select-none min-w-[80px]`}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }
  if (field.type === "radio") {
    return (
      <div className="flex gap-10">
        {field.options.map((opt, i) => (
          <label key={i} className="cursor-pointer">
            <input
              type="radio"
              name={field.id}
              checked={field.value === opt}
              onChange={() => updateField(field.id, { value: opt })}
              className="peer hidden"
            />
            <span
              className={`inline-flex items-center justify-center px-4 py-2 border-2 border-gray-400 dark:border-gray-600 rounded-md text-base transition
                peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500
                bg-white dark:bg-gray-800 text-black dark:text-white select-none min-w-[80px]`}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }
  if (field.type === "hr") {
    return (
      <hr
        style={{
          borderTopWidth: field.thickness || 1,
          borderTopStyle: field.style || "solid",
          borderTopColor: "currentColor",
          fontWeight: field.bold ? "bold" : "normal",
          width: "100%",
        }}
        className="border-gray-400 dark:border-gray-600"
      />
    );
  }
  if (field.type === "file") {
    return (
      <div className="w-full">
        <div
          className="w-full border-2 border-dashed border-gray-400 rounded-lg p-4 text-center bg-white dark:bg-gray-900 text-gray-500 cursor-pointer hover:border-blue-500 transition flex flex-col items-center justify-center gap-2"
          style={{ minHeight: 80 }}
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <FaFileAlt className="text-2xl mb-2" />
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            required={field.required}
            onChange={e => setFile(e.target.files[0])}
          />
          {file ? (
            <span className="block text-black dark:text-white">{file.name}</span>
          ) : (
            <span className="block text-lg font-semibold">
              {(field.placeholder || "DRAG AND DROP OR TAP TO ADD FILE").toUpperCase()}
            </span>
          )}
        </div>
      </div>
    );
  }
  if (field.type === "submit") {
    return (
      <div className={`w-full ${field.width === 50 ? "flex justify-center" : ""}`}>
        <button
          type="submit"
          style={{ width: `${field.width || 100}%` }}
          className="py-2 px-4 bg-blue-600 text-white rounded"
          disabled={previewMode}
        >
          {field.label || "Submit"}
        </button>
      </div>
    );
  }
  // Default: text or date
  return (
    <input
      type={field.type === "date" ? "date" : "text"}
      value={field.value}
      onChange={(e) => updateField(field.id, { value: e.target.value })}
      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
      placeholder={field.placeholder}
      required={field.required}
      pattern={field.pattern}
    />
  );
}