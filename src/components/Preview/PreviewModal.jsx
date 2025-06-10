import React, { useState, useRef } from "react";
import {
  FaArrowLeft,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PreviewField from "./PreviewField";
import { validateFields } from "../../utils/validation";

export default function PreviewModal({ fields, setPreview, theme, setTheme }) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.id,
        field.defaultValue || (field.multi ? [] : ""),
      ])
    )
  );
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fieldRefs = useRef({});

  const handleFieldChange = (id, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields(fields, formValues);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first field with error
      const firstErrorId = Object.keys(newErrors)[0];
      const ref = fieldRefs.current[firstErrorId];
      if (ref && ref.scrollIntoView) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        if (ref.querySelector && ref.querySelector("input,select,textarea")) {
          const input = ref.querySelector("input,select,textarea");
          input && input.focus();
        }
      }
      return;
    }
    setSubmitted(true);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 1800);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-start p-8 z-50">
      {/* Confirmation Pop-up */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className="flex flex-col items-center justify-center"
            style={{ minWidth: 180, minHeight: 180 }}
          >
            <div
              className="heartbeat bg-green-500 flex items-center justify-center rounded-full shadow-lg"
              style={{ width: 120, height: 120 }}
            >
              {/* Tick blob SVG, styled like provided image */}
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="45" cy="45" rx="44" ry="42" fill="#1A2942" />
                <path
                  d="M28 48L41 61L63 36"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="mt-6 text-white text-lg font-bold drop-shadow-lg">
              Submitted!
            </span>
          </div>
          <style>{`
            .heartbeat {
              animation: heartbeat 1.2s ease-in-out 2;
            }
            @keyframes heartbeat {
              0% { transform: scale(1); }
              20% { transform: scale(1.15); }
              40% { transform: scale(0.95); }
              60% { transform: scale(1.08); }
              80% { transform: scale(0.97); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      )}
      <div className="flex items-center justify-between mb-6 w-full">
        {/* Back button always left */}
        <button
          onClick={() => setPreview(false)}
          className="flex items-center px-4 py-2 rounded bg-white dark:bg-gray-800 shadow text-lg font-semibold"
        >
          <IoArrowBack className="mr-2" />
          Back
        </button>
        {/* Device preview buttons hidden on mobile */}
        <div className="hidden md:flex gap-4 items-center">
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
        </div>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="ml-4 text-xl p-2 rounded-full bg-white dark:bg-gray-800 shadow"
          title="Toggle theme"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
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
              <div
                key={field.id}
                ref={(el) => (fieldRefs.current[field.id] = el)}
              >
                <PreviewField
                  field={field}
                  value={formValues[field.id]}
                  setValue={
                    submitted
                      ? undefined
                      : (val) => handleFieldChange(field.id, val)
                  }
                  readonly={submitted}
                  error={errors[field.id]}
                />
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
