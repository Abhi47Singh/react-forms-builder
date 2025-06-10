import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaHashtag,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import FileDropPreview from "../../FileDropPreview";

export default function PreviewField({
  field,
  value,
  setValue,
  readonly,
  error,
}) {
  const previewMode = false; // or true, or from props/state if you have it

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
          <label className="mb-2 font-semibold text-black dark:text-white flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded min-h-[40px] text-black dark:text-white">
          {field.type === "file"
            ? value?.name || value || "No file selected"
            : Array.isArray(value)
            ? value.join(", ")
            : value || <span className="text-gray-400">No value</span>}
        </div>
      </div>
    );
  }

  if (field.type === "submit") {
    return (
      <div
        className={`mb-6 w-full ${
          field.width === 50 ? "flex justify-center" : ""
        }`}
      >
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

  const [internalValue, setInternalValue] = React.useState(
    field.defaultValue || (field.multi ? [] : "")
  );

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
        <label className="mb-2 font-semibold text-black dark:text-white flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {field.type === "file" ? (
          <FileDropPreview
            required={field.required}
            placeholder={field.placeholder}
            value={internalValue}
            readonly={readonly}
          />
        ) : field.type === "textarea" ? (
          <textarea
            className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholder={field.placeholder}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
          />
        ) : field.type === "dropdown" ? (
          <select
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
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
                  ${
                    internalValue.includes(opt)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-black"
                  }
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
                  ${
                    internalValue === opt
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-black dark:text-white"
                  }
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
                  ${
                    internalValue.includes(opt)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-black"
                  }
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
              onChange={(e) => setInternalValue(e.target.value)}
            />
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
