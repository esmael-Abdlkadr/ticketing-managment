import React from "react";
interface CustomeInputProps {
  label: string;
  type?: string;
  error?: string;
  placeholder: string;
  id?: string;
  icon?: React.ReactNode;
  field: any;
}
function CustomeInput({
  label,
  error,
  type = "text",
  icon,
  placeholder,
  field,
}: CustomeInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...field}
          type={type}
          className={`
          w-full px-4 py-3 rounded-lg border
          ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }
          focus:outline-none focus:ring-2 focus:ring-opacity-20 
          ${error ? "focus:ring-red-200" : "focus:ring-blue-200"}
          transition duration-200
        `}
          placeholder={placeholder}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default CustomeInput;
