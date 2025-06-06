export function validateFields(fields, formValues) {
  const newErrors = {};
  fields.forEach(field => {
    const value = formValues[field.id];

    // Required check
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      newErrors[field.id] = "This field is required";
      return;
    }

    // Email validation
    if (field.type === "email" && value) {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        newErrors[field.id] = "Please enter a valid email address (e.g. name123@gmail.com)";
      }
    }

    // Number validation
    if (field.type === "number" && value) {
      if (!/^\d+$/.test(value)) {
        newErrors[field.id] = "Only numbers are allowed (e.g. 12345)";
      }
    }

    // Phone validation (10 digits)
    if (field.type === "phone" && value) {
      if (!/^\d{10}$/.test(value)) {
        newErrors[field.id] = "Please enter a valid 10-digit phone number (e.g. 9876543210)";
      }
    }

    // URL validation (basic)
    if (field.type === "url" && value) {
      if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
        newErrors[field.id] = "Please enter a valid URL (e.g. https://example.com)";
      }
    }

    // Name validation (letters and spaces only)
    if (field.type === "name" && value) {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors[field.id] = "Only letters and spaces are allowed in name";
      }
    }

    // Dropdown/Radio validation (must be one of the options if required)
    if (
      (field.type === "dropdown" || field.type === "radio") &&
      field.required &&
      value
    ) {
      const options = field.options || [];
      if (Array.isArray(value)) {
        if (!value.every(v => options.includes(v))) {
          newErrors[field.id] = "Invalid selection";
        }
      } else if (!options.includes(value)) {
        newErrors[field.id] = "Invalid selection";
      }
    }

    // Add more type-specific validation as needed
  });
  return newErrors;
}