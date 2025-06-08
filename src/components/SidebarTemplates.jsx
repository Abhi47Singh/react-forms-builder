import React from "react";

export default function SidebarTemplates({ templates = [], onUseTemplate }) {
  return (
    <div className="flex flex-col w-full items-center gap-4 mt-8 overflow-scroll">
      {templates.map((tpl) => (
        <div
          key={tpl.name}
          className="ms:w-full w-[80%] max-w-md mb-4 p-4 bg-white dark:bg-gray-700 roundeds flex flex-col ms:flex-row items-center justify-around rounded-lg"
        >
          <div className="font-semibold mb-2">{tpl.name}</div>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            onClick={() => onUseTemplate(tpl)}
          >
            Use this form
          </button>
        </div>
      ))}
    </div>
  );
}
