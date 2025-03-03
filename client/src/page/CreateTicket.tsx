import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  FaPaperPlane, 
  FaTimes, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaArrowLeft, 
  FaPaperclip,
  FaDatabase,
  FaCreditCard,
  FaLightbulb,
  FaUserCircle,
  FaQuestionCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaHeartbeat 
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useCreateTicket } from "../hooks/tickets"; 
import SystemInfo from "../components/common/SystemInfo";

// Constants for dropdown options with icons
const CATEGORY_OPTIONS = [
  { value: "Technical", label: "Technical Issue", icon: <FaDatabase className="text-blue-500" /> },
  { value: "Billing", label: "Billing Question", icon: <FaCreditCard className="text-purple-500" /> },
  { value: "Feature Request", label: "Feature Request", icon: <FaLightbulb className="text-yellow-500" /> },
  { value: "Account", label: "Account Access", icon: <FaUserCircle className="text-green-500" /> },
  { value: "Other", label: "Other", icon: <FaQuestionCircle className="text-gray-500" /> },
];

const PRIORITY_OPTIONS = [
  { 
    value: "Low", 
    label: "Low Priority", 
    icon: <FaCheckCircle />,
    color: "emerald",
    description: "Non-urgent issues that can be addressed when time permits"
  },
  { 
    value: "Medium", 
    label: "Medium Priority", 
    icon: <FaExclamationCircle />, 
    color: "amber",
    description: "Important issues that need attention in a reasonable timeframe"
  },
  { 
    value: "High", 
    label: "High Priority", 
    icon: <FaHeartbeat />, 
    color: "rose",
    description: "Critical issues that require immediate attention"
  },
];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// Define the schema with Zod
const ticketSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters"),
  category: z.string().nonempty("Please select a category"),
  priority: z.string().nonempty("Please select a priority level"),
});

// Infer the type from the schema
type TicketFormData = z.infer<typeof ticketSchema>;

const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const { createTicket, createTicketLoading, createTicketError } = useCreateTicket();

  // React Hook Form setup with Zod resolver
  const { 
    register, 
    handleSubmit,
    control,
    formState: { errors, isSubmitting }, 
  
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: "Medium", // Default to medium priority
    }
  });



  // File drop zone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileError(null);
    
    // Filter files by size and type
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds the maximum size of 5MB`);
        return false;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError(`File "${file.name}" has unsupported format`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: MAX_FILE_SIZE
  });

  // Remove file from the list
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit: SubmitHandler<TicketFormData> = async (data) => {
    try {
      const response = await createTicket({
        ...data,
        files: files,
      });
      
      if (response?.data) {
        navigate(`/tickets/${response.data._id}`);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* System info display */}
      <SystemInfo />

      {/* Page header with improved styling */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-white">Create New Ticket</h1>
          <p className="text-blue-100 mt-2 max-w-2xl">
            Submit a new support request and we'll help you resolve your issue.
            Our team typically responds within 24 hours.
          </p>
        </div>
      </motion.div>

      {/* Main form */}
      <motion.div 
        className="bg-white rounded-xl shadow-xl overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-8 py-6">
          {/* Ticket form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title field with floating label */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                id="title"
                type="text"
                {...register("title")}
                placeholder=" "
                className={`
                  peer w-full px-4 py-3 border-2 rounded-lg bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  placeholder-transparent text-gray-700
                  ${errors.title 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}
                `}
              />
              <label 
                htmlFor="title"
                className={`
                  absolute left-4 -top-2.5 px-1 bg-white text-sm transition-all duration-200
                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm
                  ${errors.title ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}
                `}
              >
                Ticket Title <span className="text-red-500">*</span>
              </label>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </motion.div>

            {/* Category selection - Improved card style */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <>
                      {CATEGORY_OPTIONS.map((option) => (
                        <div 
                          key={option.value}
                          className={`
                            relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 
                            ${field.value === option.value 
                              ? "ring-2 ring-blue-500 scale-105" 
                              : "border border-gray-200 hover:shadow-md"}
                          `}
                          onClick={() => field.onChange(option.value)}
                        >
                          <div className="p-5">
                            <div className="flex justify-between items-start">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {option.icon}
                              </div>
                              {field.value === option.value && (
                                <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <FaCheckCircle className="text-white text-sm" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium mt-3">{option.label}</h3>
                          </div>
                          {field.value === option.value && (
                            <div className="bg-blue-500 h-1 w-full absolute bottom-0 left-0"></div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </motion.div>

            {/* Priority selection - Improved visual style */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <>
                      {PRIORITY_OPTIONS.map((option) => {
                        const isSelected = field.value === option.value;
                        return (
                          <div 
                            key={option.value}
                            onClick={() => field.onChange(option.value)}
                            className={`
                              relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all
                              ${isSelected
                                ? option.value === "Low"
                                  ? "border-emerald-500 bg-emerald-50"
                                  : option.value === "Medium"
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-rose-500 bg-rose-50"
                                : "border-gray-200 hover:border-gray-300"}
                            `}
                          >
                            <div className="flex items-center p-4">
                              <div 
                                className={`
                                  h-10 w-10 rounded-full flex items-center justify-center mr-4
                                  ${option.value === "Low"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : option.value === "Medium"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-rose-100 text-rose-600"}
                                `}
                              >
                                {option.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className={`
                                  font-medium
                                  ${option.value === "Low"
                                    ? "text-emerald-700"
                                    : option.value === "Medium"
                                    ? "text-amber-700"
                                    : "text-rose-700"}
                                `}>
                                  {option.label}
                                </h3>
                                <p className="text-gray-600 text-sm">{option.description}</p>
                              </div>
                              <div className="ml-4">
                                <div className={`
                                  h-6 w-6 rounded-full border-2
                                  ${isSelected
                                    ? option.value === "Low"
                                      ? "border-emerald-500 bg-emerald-500"
                                      : option.value === "Medium"
                                      ? "border-amber-500 bg-amber-500"
                                      : "border-rose-500 bg-rose-500"
                                    : "border-gray-300"}
                                `}>
                                  {isSelected && (
                                    <FaCheckCircle className="text-white w-full h-full p-0.5" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </motion.div>

            {/* Description field */}
            <motion.div className="relative" variants={itemVariants}>
              <textarea
                id="description"
                {...register("description")}
                rows={6}
                placeholder=" "
                className={`
                  peer w-full px-4 py-3 border-2 rounded-lg bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  placeholder-transparent text-gray-700
                  ${errors.description 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}
                `}
              ></textarea>
              <label 
                htmlFor="description"
                className={`
                  absolute left-4 -top-2.5 px-1 bg-white text-sm transition-all duration-200
                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm
                  ${errors.description ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}
                `}
              >
                Description <span className="text-red-500">*</span>
              </label>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </motion.div>

            {/* File attachments - Improved drag & drop */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attachments (Optional)
              </label>
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center
                  transition-colors cursor-pointer text-center
                  ${isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"}
                `}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <FaPaperclip className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      {isDragActive
                        ? "Drop files here..."
                        : "Drag and drop files here, or click to select files"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF, PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* File error message */}
              {fileError && (
                <div className="mt-2 text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-lg">
                  <FaExclamationTriangle className="mr-1 flex-shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* File list with improved styling */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between p-3"
                      >
                        <div className="flex items-center overflow-hidden">
                          <div className={`
                            h-8 w-8 rounded-lg flex items-center justify-center mr-3
                            ${file.type.includes('image') ? 'bg-blue-100 text-blue-600' : 
                              file.type.includes('pdf') ? 'bg-red-100 text-red-600' : 
                              'bg-gray-100 text-gray-600'}
                          `}>
                            <FaPaperclip />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-3 flex-shrink-0 text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Form error display */}
            {createTicketError && (
              <motion.div 
                variants={itemVariants}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaExclamationTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error Creating Ticket</h3>
                  <p className="text-sm text-red-600 mt-1">
                    {typeof createTicketError === 'string' 
                      ? createTicketError 
                      : "An error occurred while creating the ticket. Please try again."}
                  </p>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Form buttons - Improved styling and fixed to bottom */}
        <div className="border-t bg-gray-50 px-8 py-4 sticky bottom-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {/* Show form progress or submit guidance */}
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Fill all required fields marked with <span className="text-red-500 mx-1">*</span>
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ticket-form" // Connect to form
                disabled={isSubmitting || createTicketLoading}
                className={`
                  px-6 py-2 font-medium text-white rounded-lg shadow-sm 
                  flex items-center transition-all duration-200
                  ${(isSubmitting || createTicketLoading)
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"}
                `}
                onClick={handleSubmit(onSubmit)}
              >
                {(isSubmitting || createTicketLoading) ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Create Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateTicketPage;