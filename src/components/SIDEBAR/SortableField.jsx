// SortableField.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FieldLabelEditor from "../../FieldLabelEditor";
import FieldInputRenderer from "../Preview/FieldInputRenderer";
import FieldActions from "../../FieldActions";
import ParagraphField from "../FormSection/ParagraphField";
import { typeIcons } from "../../utils/icons";

const MIN_SIZE = 10;
const MAX_SIZE = 50;

export default function SortableField({
  field,
  updateField,
  removeField,
  onEdit,
  previewMode,
  onStartSwitch,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  // Shared dragging style for DnD-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
    boxShadow: isDragging
      ? "0 0 0 2px #2563eb, 0 8px 24px 0 rgba(0,0,0,0.12)"
      : undefined,
    border: isDragging ? "2px solid #2563eb" : undefined,
  };

  // Paragraph fields get their own component
  if (field.type === "p") {
    return (
      <ParagraphField
        field={field}
        updateField={updateField}
        removeField={removeField}
        listeners={listeners}
        attributes={attributes}
        setNodeRef={setNodeRef}
        transform={transform}
        transition={transition}
        isDragging={isDragging}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative p-3 border rounded group select-none bg-gray-50 dark:bg-gray-800"
    >
      <FieldLabelEditor
        field={field}
        onEdit={onEdit}
        listeners={listeners}
        attributes={attributes}
        onStartSwitch={onStartSwitch}
      />
      <FieldInputRenderer
        field={field}
        updateField={updateField}
        previewMode={previewMode}
      />
      <FieldActions field={field} removeField={removeField} />
    </div>
  );
}

export function SortableFieldGroup({
  group,
  updateField,
  removeField,
  onEdit,
  onStartSwitch,
  switchMode,
  switchSource,
  switchTarget,
  isMobile,
  onSelectTarget,
}) {
  // group is an array of two fields
  return (
    <div className="flex gap-4 w-full">
      {group.map((field) => (
        <div key={field.id} className="flex-1">
          <SortableField
            field={field}
            updateField={updateField}
            removeField={removeField}
            onEdit={onEdit}
            onStartSwitch={onStartSwitch}
            switchMode={switchMode}
            switchSource={switchSource}
            switchTarget={switchTarget}
            isMobile={isMobile}
            onSelectTarget={onSelectTarget}
          />
        </div>
      ))}
    </div>
  );
}
