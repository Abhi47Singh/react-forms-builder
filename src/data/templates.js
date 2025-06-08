// filepath: d:\ReactForms\src\data\templates.js
const TEMPLATES = [
  {
    name: "Contact Form",
    fields: [
      { type: "name", label: "Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      { type: "textarea", label: "Message", width: 100, value: "" },
      { type: "submit", label: "Submit", width: 100, value: "" },
    ],
  },
  {
    name: "Job Application",
    fields: [
      { type: "name", label: "Full Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      { type: "file", label: "Resume", width: 100, value: "" },
      { type: "textarea", label: "Cover Letter", width: 100, value: "" },
      { type: "submit", label: "Apply", width: 100, value: "" },
    ],
  },
  {
    name: "Event Registration",
    fields: [
      { type: "name", label: "Attendee Name", width: 100, value: "" },
      { type: "email", label: "Email", width: 100, value: "" },
      {
        type: "dropdown",
        label: "Session",
        width: 100,
        value: "",
        options: ["Morning", "Afternoon"],
      },
      { type: "submit", label: "Register", width: 100, value: "" },
    ],
  },
];

export default TEMPLATES;