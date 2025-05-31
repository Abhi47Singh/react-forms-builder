import React, { useState } from "react";
import { FaArrowLeft, FaDesktop, FaTabletAlt, FaMobileAlt, FaMoon, FaSun, FaFileAlt, FaUser, FaEnvelope, FaCalendarAlt, FaHashtag, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { typeIcons } from "./icons";

function FileDropPreview({ required, placeholder, value, readonly }) {
  // If readonly, just show the file name or placeholder
  if (readonly) {
    return (
      <div className="w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-white dark:bg-gray-900 text-gray-500 flex flex-col items-center justify-center gap-2" style={{ minHeight: 80 }}>
        <FaFileAlt className="text-2xl mb-2" />
        <span className="block text-black dark:text-white">{value ? value.name || value : (placeholder || "Choose a file").toUpperCase()}</span>
      </div>
    );
  }

  const [file, setFile] = React.useState(null);
  const inputRef = React.useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-white dark:bg-gray-900 text-gray-500 cursor-pointer hover:border-blue-500 transition flex flex-col items-center justify-center gap-2"
      style={{ minHeight: 80 }}
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <FaFileAlt className="text-2xl mb-2" />
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        required={required}
        onChange={handleChange}
      />
      {file ? (
        <span className="block text-black dark:text-white">{file.name}</span>
      ) : (
        <span className="block text-lg font-semibold">
          {(placeholder || "Choose a file").toUpperCase()}
        </span>
      )}
    </div>
  );
}

function PreviewField({ field, value, setValue, readonly, error }) {
  // For readonly mode, just render the value as plain text
  if (readonly) {
    if (field.type === "p" || field.type === "paragraph") {
      return (
        <div className="mb-6">
          <span
            style={{
              fontWeight: field.bold ? "bold" : "normal",
              fontStyle: field.italic ? "italic" : "normal",
              fontSize: field.fontSize || 18,
              textAlign: field.align || "left",
              marginTop: Number(field.margin) || 0,
              marginBottom: Number(field.margin) || 0,
              display: "block",
            }}
          >
            {field.text}
          </span>
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
          className="border-gray-400 dark:border-gray-600 mb-6"
        />
      );
    }
    if (field.type === "submit") {
      return null;
    }
    return (
      <div className="mb-6">
        {field.type !== "hr" && (
          <label className="block mb-2 font-semibold text-black dark:text-white flex items-center gap-2">
            {field.label}
          </label>
        )}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded min-h-[40px] text-black dark:text-white">
          {field.type === "file"
            ? (value?.name || value || "No file selected")
            : Array.isArray(value)
              ? value.join(", ")
              : value || <span className="text-gray-400">No value</span>}
        </div>
      </div>
    );
  }

  // --- ADD THIS BLOCK FOR SUBMIT BUTTON ---
  if (field.type === "submit") {
    return (
      <div className={`mb-6 w-full ${field.width === 50 ? "flex justify-center" : ""}`}>
        <button
          type="submit"
          style={{ width: `${field.width || 100}%` }}
          className="py-2 px-4 bg-blue-600 text-white rounded"
        >
          {field.label || "Submit"}
        </button>
      </div>
    );
  }
  // --- END SUBMIT BUTTON BLOCK ---

  const [internalValue, setInternalValue] = React.useState(field.defaultValue || (field.multi ? [] : ""));

  React.useEffect(() => {
    if (setValue) setValue(internalValue);
    // eslint-disable-next-line
  }, [internalValue]);

  if (field.type === "p" || field.type === "paragraph") {
    return (
      <div className="mb-6">
        <span
          style={{
            fontWeight: field.bold ? "bold" : "normal",
            fontStyle: field.italic ? "italic" : "normal",
            fontSize: field.fontSize || 18,
            textAlign: field.align || "left",
            marginTop: Number(field.margin) || 0,
            marginBottom: Number(field.margin) || 0,
            display: "block",
          }}
        >
          {field.text}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {field.type !== "hr" && (
        <label className="block mb-2 font-semibold text-black dark:text-white flex items-center gap-2">
          {field.label}
        </label>
      )}
      <div className="relative">
        {field.type === "file" ? (
          <FileDropPreview required={field.required} placeholder={field.placeholder} value={internalValue} readonly={readonly} />
        ) : field.type === "textarea" ? (
          <textarea
            className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholder={field.placeholder}
            value={internalValue}
            onChange={e => setInternalValue(e.target.value)}
          />
        ) : field.type === "dropdown" ? (
          <select
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            value={internalValue}
            onChange={e => setInternalValue(e.target.value)}
          >
            {field.options.map((o, i) => (
              <option key={i}>{o}</option>
            ))}
          </select>
        ) : field.type === "radio" && field.multi ? (
          <div className="flex gap-4">
            {field.options.map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${internalValue.includes(opt) ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="checkbox"
                  checked={internalValue.includes(opt)}
                  onChange={() => {
                    setInternalValue((prev) =>
                      prev.includes(opt)
                        ? prev.filter((v) => v !== opt)
                        : [...prev, opt]
                    );
                  }}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : field.type === "radio" ? (
          <div className="flex gap-4">
            {field.options.map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${internalValue === opt ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-black dark:text-white"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="radio"
                  checked={internalValue === opt}
                  onChange={() => setInternalValue(opt)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : field.type === "checkbox" ? (
          <div className="flex gap-4">
            {(field.options || []).map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${internalValue.includes(opt) ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="checkbox"
                  checked={internalValue.includes(opt)}
                  onChange={() =>
                    setInternalValue((prev) =>
                      prev.includes(opt)
                        ? prev.filter((v) => v !== opt)
                        : [...prev, opt]
                    )
                  }
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : field.type === "hr" ? (
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
        ) : (
          <div className="relative mb-4">
            {(field.type === "text" || field.type === "name") && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaUser />
              </span>
            )}
            {field.type === "email" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaEnvelope />
              </span>
            )}
            {field.type === "date" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaCalendarAlt />
              </span>
            )}
            {field.type === "number" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaHashtag />
              </span>
            )}
            {field.type === "address" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaMapMarkerAlt />
              </span>
            )}
            {field.type === "phone" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <FaPhone />
              </span>
            )}
            <input
              type={field.type === "date" ? "date" : "text"}
              className="w-full pl-10 pr-3 py-2 border rounded 
                bg-white dark:bg-gray-800 
                text-black dark:text-white 
                border-gray-300 dark:border-gray-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.placeholder}
              value={internalValue}
              onChange={e => setInternalValue(e.target.value)}
            />
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}

export default function PreviewModal({ fields, setPreview, theme, setTheme }) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(
      fields.map(field => [field.id, field.defaultValue || (field.multi ? [] : "")])
    )
  );
  const [errors, setErrors] = useState({});

  const handleFieldChange = (id, value) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [id]: undefined,
    }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formValues[field.id]) {
        newErrors[field.id] = "This field is required";
      }
      // For file fields, check for file presence
      if (field.type === "file" && field.required && !formValues[field.id]) {
        newErrors[field.id] = "File is required";
      }
      // For multi fields (checkboxes), check for empty array
      if (field.multi && field.required && Array.isArray(formValues[field.id]) && formValues[field.id].length === 0) {
        newErrors[field.id] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Optionally, scroll to first error
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-start p-8 z-50">
      <button
        className="absolute top-8 right-12 z-50 text-2xl p-2 rounded-full bg-white dark:bg-gray-800 shadow text-black dark:text-white"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        title="Toggle theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
      <div className="flex gap-4 mb-6 mt-2 items-center">
        <button
          onClick={() => setPreviewMode("desktop")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "desktop"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Desktop"
        >
          <FaDesktop />
        </button>
        <button
          onClick={() => setPreviewMode("tablet")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "tablet"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Tablet"
        >
          <FaTabletAlt />
        </button>
        <button
          onClick={() => setPreviewMode("mobile")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "mobile"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Mobile"
        >
          <FaMobileAlt />
        </button>
        <button
          className="ml-8 px-4 py-2 border rounded text-black dark:text-white border-gray-300 dark:border-gray-600"
          onClick={() => setPreview(false)}
        >
          <span className="inline-flex items-center gap-2"><FaArrowLeft /> Back</span>
        </button>
      </div>
      <div
        className={`
          w-full
          ${previewMode === "desktop" ? "max-w-2xl" : ""}
          ${previewMode === "tablet" ? "max-w-lg" : ""}
          ${previewMode === "mobile" ? "max-w-xs" : ""}
          bg-transparent
          overflow-auto scrollbar-hide
          max-h-[80vh]
          mx-auto
          p-2
        `}
      >
        <form onSubmit={handleSubmit}>
          <div
            className="border border-dashed border-gray-400 rounded-lg bg-transparent p-8 mx-auto flex flex-col gap-4"
            style={{
              minHeight: 400,
              background: "transparent",
              overflow: "visible",
            }}
          >
            {fields.map((field) => (
              <PreviewField
                key={field.id}
                field={field}
                value={formValues[field.id]}
                setValue={submitted ? undefined : (val) => handleFieldChange(field.id, val)}
                readonly={submitted}
                error={errors[field.id]}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}