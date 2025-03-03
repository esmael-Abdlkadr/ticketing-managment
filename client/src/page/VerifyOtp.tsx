import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaEnvelope, 
  FaClock,
  FaRedo 
} from "react-icons/fa";
import { useRequestNewOtp, useVerifyOtp } from "../hooks/auth";
import SystemInfo from "../components/common/SystemInfo";

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(4, "Please enter all 4 digits of your verification code")
});

type OtpFormData = z.infer<typeof otpSchema>;

const VerifyOtpPage: React.FC = () => {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const emailRef = useRef<string | null>(localStorage.getItem("email"));
  const navigate = useNavigate();
  
  const { verifyOtp, verifyError, loadingVerify } = useVerifyOtp()
  const { requestNewOtp, loadingRequestNewOtp } = useRequestNewOtp();
  
  // Setup refs for OTP input fields
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  
  // React Hook Form setup
  const { handleSubmit, formState, setError, clearErrors } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });
  
  // Setup countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);
  
  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    
    // Only take the last character if more than one digit is pasted
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);
    
    // Jump to next input if we entered a value and there's a next input
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
    
    // Check if we have all digits to potentially auto-submit
    if (newOtpValues.every(val => val !== "") && !newOtpValues.includes("")) {
      // Automatically submit when all digits are filled
      submitOtp(newOtpValues.join(""));
    }
    
    // Clear form errors when user starts typing again
    clearErrors("otp");
  };
  
  // Handle keydown for backspace and arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // If current input is empty and backspace is pressed, move to previous input
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input with left arrow
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      // Move to next input with right arrow
      otpInputsRef.current[index + 1]?.focus();
    }
  };
  
  // Focus first input on mount
  useEffect(() => {
    otpInputsRef.current[0]?.focus();
  }, []);
  
  // Handle form submission
  const submitOtp = async (otpString: string) => {
    if (isSubmitting) return;
    
    if (otpString.length !== 4) {
      setError("otp", { message: "Please enter all 4 digits of your verification code" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (emailRef.current) {
        await verifyOtp({ otp: otpString, email: emailRef.current });
        
        // Show success state
        setVerificationSuccess(true);
        
        // Redirect after successful verification
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error("Email not found. Please try logging in again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("otp", { 
        message: typeof verifyError === "string" 
          ? verifyError 
          : "Invalid verification code. Please try again." 
      });
      // Reset OTP fields on error
      setOtpValues(["", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle resending OTP
  const handleResendOTP = async () => {
    try {
      if (emailRef.current) {
        await requestNewOtp(emailRef.current);
        
        // Reset countdown
        setCountdown(60);
        setCanResend(false);
        
        // Reset fields
        setOtpValues(["", "", "", ""]);
        otpInputsRef.current[0]?.focus();
      } else {
        throw new Error("Email not found. Please try logging in again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <SystemInfo />
        
        <div className="mt-8 flex justify-center">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              {/* Header with shine effect */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full"></div>
                <div className="absolute top-12 -left-12 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                
                <h1 className="text-2xl font-bold text-white relative z-10 text-center">
                  Verify Your Email
                </h1>
                
                <p className="text-blue-100 mt-2 text-center relative z-10 max-w-sm mx-auto">
                  We've sent a verification code to{" "}
                  <span className="font-medium text-white">
                    {emailRef.current || "your email address"}
                  </span>
                </p>
                
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
              </div>
              
              <div className="px-6 pb-6 pt-0">
                {/* Success state */}
                <AnimatePresence>
                  {verificationSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 15,
                          delay: 0.2
                        }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                      >
                        <FaCheckCircle className="text-green-600 text-4xl" />
                      </motion.div>
                      
                      <h2 className="text-xl font-semibold text-gray-800">
                        Verification Successful!
                      </h2>
                      
                      <p className="text-gray-600 text-center mt-2">
                        Your email has been verified successfully. Redirecting you...
                      </p>
                      
                      <div className="mt-4 relative h-1 w-36 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-green-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-6"
                    >
                      {/* OTP Input Form */}
                      <form onSubmit={handleSubmit(() => submitOtp(otpValues.join("")))}>
                        <div className="flex flex-col items-center">
                          {/* OTP inputs */}
                          <div className="flex justify-center gap-3 mb-6">
                            {[0, 1, 2, 3].map((index) => (
                              <div key={index} className="w-16 h-16 relative">
                                <input
                                  ref={(el) => (otpInputsRef.current[index] = el)}
                                  type="text"
                                  maxLength={1}
                                  value={otpValues[index]}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  onFocus={(e) => e.target.select()}
                                  className="w-full h-full text-center text-2xl font-bold bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all outline-none"
                                />
                                <div 
                                  className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ${
                                    otpValues[index] ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}
                                ></div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Error message */}
                          <AnimatePresence>
                            {formState.errors.otp && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-red-600 mb-4"
                              >
                                <FaExclamationCircle />
                                <span className="text-sm">{formState.errors.otp.message}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Verification button */}
                          <button
                            type="submit"
                            disabled={isSubmitting || loadingVerify || otpValues.includes("")}
                            className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
                              isSubmitting || loadingVerify || otpValues.includes("")
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                            }`}
                          >
                            {isSubmitting || loadingVerify ? (
                              <span className="flex items-center justify-center">
                                <svg 
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  fill="none" 
                                  viewBox="0 0 24 24"
                                >
                                  <circle 
                                    className="opacity-25" 
                                    cx="12" cy="12" r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                  />
                                  <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Verifying...
                              </span>
                            ) : (
                              "Verify Code"
                            )}
                          </button>
                        </div>
                      </form>
                      
                      {/* Resend OTP section */}
                      <div className="mt-8 flex flex-col items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <FaClock className="text-gray-400" />
                          {canResend ? (
                            <span>Didn't receive a code?</span>
                          ) : (
                            <span>Resend code in {formatTime(countdown)}</span>
                          )}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: canResend ? 1.03 : 1 }}
                          whileTap={{ scale: canResend ? 0.98 : 1 }}
                          onClick={handleResendOTP}
                          disabled={!canResend || loadingRequestNewOtp}
                          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition ${
                            canResend && !loadingRequestNewOtp
                              ? "bg-gray-100 text-blue-600 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {loadingRequestNewOtp ? (
                            <>
                              <svg 
                                className="animate-spin h-4 w-4 text-blue-600" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" cy="12" r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                />
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <FaRedo className={canResend ? "text-blue-600" : "text-gray-400"} />
                              Resend Code
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                <FaEnvelope className="inline-block mr-1 mb-1" />
                Check your spam folder if you don't see the email in your inbox
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;