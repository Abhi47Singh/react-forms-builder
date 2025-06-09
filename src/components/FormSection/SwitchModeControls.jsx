import React from "react";
import { IoIosSwitch } from "react-icons/io";

export default function SwitchModeControls({
  switchMode,
  showToast,
  switchTarget,
  onSwitchFields,
  onAbortSwitch,
}) {
  if (!switchMode) return null;

  return (
    <>
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow z-50">
          Select field to switch places
        </div>
      )}
      {switchTarget && (
        <button
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold z-50 flex items-center gap-2"
          onClick={onSwitchFields}
        >
          <IoIosSwitch className="text-2xl" />
          Switch
        </button>
      )}
      <button
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold z-50"
        onClick={onAbortSwitch}
      >
        Cancel
      </button>
    </>
  );
}