import React from "react";
import { FaFileAlt } from "react-icons/fa";

export default function FileDropPreview({ required, placeholder, value, readonly }) {
  const [file, setFile] = React.useState(null);
  const inputRef = React.useRef();

  if (readonly) {
    return (
      <div className="w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-white dark:bg-gray-900 text-gray-500 flex flex-col items-center justify-center gap-2" style={{ minHeight: 80 }}>
        <FaFileAlt className="text-2xl mb-2" />
        <span className="block text-black dark:text-white">{value ? value.name || value : (placeholder || "Choose a file").toUpperCase()}</span>
      </div>
    );
  }

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