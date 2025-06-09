import React, { useEffect, useState } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import SidebarTemplates from "./SidebarTemplates";
import { typeIcons } from "./icons"; // Adjust path if needed
import FieldConfigForm from "./FieldConfigForm";

export default function MobileSidebarDrawer({
  open,
  COMPONENTS,
  TEMPLATES,
  tab,
  setTab,
  onClose,
  onUseTemplate,
  config,
  setConfig,
  updateField,
  handleShare,
  openMobilePreview,
  openDesktopPreview,
  onAddField, // <-- Add this line
}) {
  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => {
    if (open && tab === null) {
      setMenuKey((k) => k + 1); // Change key to force remount
    }
  }, [open, tab]);

  useEffect(() => {
    if (tab === "preview") {
      if (window.innerWidth < 840) {
        if (typeof openMobilePreview === "function") openMobilePreview();
      } else {
        if (typeof openDesktopPreview === "function") openDesktopPreview();
      }
      setTab(null);
      onClose();
    }
    // eslint-disable-next-line
  }, [tab]);

  const menuOptions = [
    { label: "Components", value: "components" },
    { label: "Templates", value: "templates" },
    { label: "Preview", value: "preview" },
    { label: "Share Form", value: "share" },
  ];

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black/40 backdrop-blur-md ms:hidden
        transition-all duration-300
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={`
          fixed top-0 left-0 h-full
          bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-lg
          transition-transform duration-300 ease-in
          ${open ? "translate-x-0" : "-translate-x-[85vw]"}
        `}
        style={{
          width: "85vw",
          maxWidth: "none",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          {tab !== null ? (
            <>
              <button
                onClick={() => setTab(null)}
                className="text-2xl text-gray-600 hover:text-blue-500"
              >
                <IoArrowBack />
              </button>
              <div className="flex-1 text-right font-bold text-xl pr-8">
                {menuOptions.find((opt) => opt.value === tab)?.label}
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-gray-600 hover:text-red-500 ml-2"
              >
                <IoClose />
              </button>
            </>
          ) : (
            <>
              <div />
              <button
                onClick={onClose}
                className="text-2xl text-gray-600 hover:text-red-500"
              >
                <IoClose />
              </button>
            </>
          )}
        </div>

        {/* Main Menu or Submenu */}
        <div
          className="flex flex-col items-center w-full gap-4 px-2 overflow-y-auto"
          style={{ maxHeight: "100vh" }}
          key={menuKey}
        >
          {tab === null && (
            <div
              key={menuKey}
              className="flex flex-col items-center justify-center w-full h-[calc(100vh-64px)] -mt-10" // 64px = approx. top bar height
              style={{ minHeight: "100vh" }}
            >
              {menuOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => setTab(opt.value)}
                  className={`
                    text-2xl font-semibold w-3/4 py-4 rounded-lg
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    hover:underline hover:text-blue-600 dark:hover:text-blue-400
                    transition-all duration-300
                    opacity-0 animate-fade-in
                  `}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {tab === "components" && (
            <div className="grid w-full mt-14 gap-y-6 mb-32 xxs:grid-cols-2 grid-cols-1">
              {/* Render components as draggable items */}
              {COMPONENTS.map((comp, i) => (
                <button
                  key={comp.type}
                  className="flex items-center justify-evenly bg-gray-100 dark:bg-gray-700 rounded-lg py-4 text-lg font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer text-center w-[80%] mx-auto xs500:flex-row xxs:flex-col flex-row"
                  onClick={() => {
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
                  }}
                >
                  <span
                    className={`${comp.type === "submit" ? "text-3xl" : ""}`}
                  >
                    {typeIcons[comp.type] &&
                      React.createElement(typeIcons[comp.type])}
                  </span>
                  <span className="">{comp.label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "templates" && (
            <div className="flex flex-col justify-between items-center w-full mt-8 gap-8">
              <SidebarTemplates
                templates={TEMPLATES}
                onUseTemplate={onUseTemplate}
              />
            </div>
          )}

          {tab === "config" && config ? (
            <div className="w-full px-6">
              <FieldConfigForm
                config={config}
                setConfig={setConfig}
                updateField={updateField}
                onAddField={onAddField}
                onCancel={() => {
                  setConfig(null);
                  setTab(null);
                  onClose();
                }}
              />
            </div>
          ) : null}

          {tab === "share" && (
            <div className="flex flex-col items-center justify-center w-full h-full mt-[40%]">
              <button
                onClick={() => {
                  console.log("Share button clicked!");
                  handleShare();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold mt-8"
              >
                Copy Share Link
              </button>
              <p className="mt-4 text-gray-500 text-center">
                Tap the button to copy a shareable link for your form.
              </p>
            </div>
          )}

          {tab === "preview" && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <button
                onClick={() => {
                  if (window.innerWidth < 840) {
                    setTab(null);
                    onClose();
                    // Call a prop to open mobile preview
                    if (typeof openMobilePreview === "function")
                      openMobilePreview();
                  } else {
                    setTab(null);
                    onClose();
                    // Call a prop to open desktop preview
                    if (typeof openDesktopPreview === "function")
                      openDesktopPreview();
                  }
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold mt-8"
              >
                Open Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
