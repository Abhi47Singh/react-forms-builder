import React from "react";

export default function SidebarTemplates({ templates, onUseTemplate }) {
  return (
    <div>
      {templates.map((tpl) => (
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
  );
}