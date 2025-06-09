import React from "react";
import SortableField, { SortableFieldGroup } from "../SIDEBAR/SortableField";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function FieldList({
  fields,
  updateField,
  removeField,
  handleEdit,
  onStartSwitch,
  isSidebarDragging,
  overId,
  isMobile,
  switchMode,
  switchSource,
  switchTarget,
  onSelectTarget,
}) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 h-full">
        {fields.length === 0 ? (
          <div className="flex flex-1 items-center justify-center h-full w-full text-gray-400 text-2xl select-none">
            Tap to add fields
          </div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className={`
                relative
                ${
                  switchMode && field.id === switchSource
                    ? "ring-4 ring-blue-400"
                    : ""
                }
                ${
                  switchMode && switchTarget && field.id === switchTarget
                    ? "ring-4 ring-green-400"
                    : ""
                }
                ${
                  switchMode &&
                  field.id !== switchSource &&
                  (!switchTarget || field.id !== switchTarget)
                    ? "brightness-50"
                    : ""
                }
                transition-all
              `}
              onClick={() => {
                if (switchMode && !switchTarget && field.id !== switchSource) {
                  onSelectTarget(field.id);
                }
              }}
            >
              <SortableField
                field={field}
                updateField={updateField}
                removeField={removeField}
                onEdit={handleEdit}
                onStartSwitch={onStartSwitch}
                switchMode={switchMode}
                switchSource={switchSource}
                switchTarget={switchTarget}
                isMobile={isMobile}
                onSelectTarget={onSelectTarget}
              />
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop: group fields into rows
  let rows = [];
  for (let i = 0; i < fields.length; ) {
    if (fields[i].width === 50 && fields[i + 1] && fields[i + 1].width === 50) {
      rows.push(
        <SortableFieldGroup
          key={fields[i].id + fields[i + 1].id}
          group={[fields[i], fields[i + 1]]}
          updateField={updateField}
          removeField={removeField}
        />
      );
      i += 2;
    } else {
      if (isSidebarDragging && overId === fields[i].id) {
        rows.push(
          <div
            key="placeholder"
            className="h-16 bg-blue-200 dark:bg-blue-900 border-2 border-blue-400 rounded flex items-center justify-center mb-2 animate-pulse"
          >
            Drop here
          </div>
        );
      }
      rows.push(
        <SortableField
          key={fields[i].id}
          field={fields[i]}
          updateField={updateField}
          removeField={removeField}
          onEdit={handleEdit}
          onStartSwitch={onStartSwitch}
          isSwitching={switchMode}
          isMobile={isMobile}
          onSelectTarget={onSelectTarget}
        />
      );
      i += 1;
    }
  }
  if (isSidebarDragging && overId === null) {
    rows.push(
      <div
        key="placeholder-end"
        className="h-16 bg-blue-200 dark:bg-blue-900 border-2 border-blue-400 rounded flex items-center justify-center mb-2 animate-pulse"
      >
        Drop here
      </div>
    );
  }

  return (
    <SortableContext
      items={fields.map((f) => f.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex flex-col gap-4 h-full">
        {fields.length === 0 ? (
          <div className="flex flex-1 items-center justify-center h-full w-full text-gray-400 text-2xl select-none">
            Drop to add fields
          </div>
        ) : (
          rows
        )}
      </div>
    </SortableContext>
  );
}
