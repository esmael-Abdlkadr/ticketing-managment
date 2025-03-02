import React from "react";

/**
 * Spinner component for loading states
 */
interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray" | string;
  center?: boolean;
  text?: string;
  showTimestamp?: boolean;
  showUser?: boolean;
  user?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "blue",
  center = false,
  text,
  showTimestamp = false,
  showUser = false,
  user = "esmael-Abdlkadr",
  className = "",
}) => {
  // Size maps for spinner and text
  const spinnerSizeClasses = {
    xs: "h-3 w-3",
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Color variants
  const colorClasses: { [key: string]: string } = {
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    yellow: "border-yellow-600",
    purple: "border-purple-600",
    gray: "border-gray-600",
  };

  const timestamp = showTimestamp
    ? new Date().toISOString().replace("T", " ").substring(0, 19)
    : null;

  return (
    <div
      className={`${
        center
          ? "flex flex-col items-center justify-center"
          : "flex items-center"
      } ${className}`}
    >
      <div
        className={`
          animate-spin rounded-full
          border-[3px] border-t-transparent
          ${colorClasses[color] || `border-${color}-600`}
          ${spinnerSizeClasses[size] || spinnerSizeClasses.md}
        `}
        role="status"
        aria-label="Loading"
      />

      {(text || showTimestamp || showUser) && (
        <div className={`ml-3 ${center ? "text-center mt-2" : ""}`}>
          {text && (
            <p className={`${textSizeClasses[size]} text-gray-700`}>{text}</p>
          )}
          {showTimestamp && (
            <p className="text-xs text-gray-500">{timestamp}</p>
          )}
          {showUser && <p className="text-xs text-gray-500">User: {user}</p>}
        </div>
      )}
    </div>
  );
};

export default Spinner;
