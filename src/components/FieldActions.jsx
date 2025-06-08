import React from "react";
import { FaTrash } from "react-icons/fa";

export default function FieldActions({ field, removeField }) {
  return (
    <div className="absolute right-2 top-2 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity">
      <button
        onClick={() => removeField(field.id)}
        className="text-red-600 hover:text-red-800"
        type="button"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );
}
