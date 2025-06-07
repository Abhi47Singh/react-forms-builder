// SidebarDraggable.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { IoIosDoneAll } from "react-icons/io";
import { FaGripLines, FaReadme } from "react-icons/fa6";
import { RiTextSnippet } from "react-icons/ri";
import { LuUngroup } from "react-icons/lu";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoLocation, IoPerson } from "react-icons/io5";
import { MdNumbers, MdEmail } from "react-icons/md";

const typeIconMap = {
  name: <IoPerson className="hidden lg:inline text-lg" />,
  email: <MdEmail className="hidden lg:inline text-lg" />,
  phone: <MdNumbers className="hidden lg:inline text-lg" />,
  address: <IoLocation className="hidden lg:inline text-lg" />,
  date: <BsCalendarDateFill className="hidden lg:inline text-lg" />,
  dropdown: <IoIosArrowDropdownCircle className="hidden lg:inline text-lg" />,
  radio: <LuUngroup className="hidden lg:inline text-lg" />,
  textarea: <FaReadme className="hidden lg:inline text-lg" />,
  p: <RiTextSnippet className="hidden lg:inline text-lg" />,
  paragraph: <RiTextSnippet className="hidden lg:inline text-lg" />,
  hr: <FaGripLines className="hidden lg:inline text-lg" />,
  // file: <FaReadme className="hidden lg:inline text-lg" />,
  submit: <IoIosDoneAll className="hidden lg:inline text-3xl" />,
};

export default function SidebarDraggable({ type, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { fromSidebar: true },
  });

  return (
    <div
      className="w-full py-4 px-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-center cursor-grab active:cursor-grabbing dark:text-white mb-2 text-center"
      tabIndex={0}
      role="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ minHeight: 60 }}
    >
      <span className="flex items-center gap-2 justify-center w-full">
        {typeIconMap[type]}
        {label}
      </span>
    </div>
  );
}
