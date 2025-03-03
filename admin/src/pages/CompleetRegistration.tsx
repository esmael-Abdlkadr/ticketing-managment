import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaKey, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useCompleteRegistration } from "../hooks/users"; 
import showToast from "../utils/toastHelper";


const CompleteRegistration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [validations, setValidations] = useState({
    passwordsMatch: true,
    passwordLength: false,
    hasSpecialChar: false,
    hasNumber: false,
    hasUpperCase: false,
  });

  const { completeRegistration, registrationLoading } = useCompleteRegistration();

  useEffect(() => {
    if (!token) {
      showToast("Invalid or missing registration token", "error");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    // Validate password as user types
    setValidations({
      passwordsMatch: formState.password === formState.confirmPassword,
      passwordLength: formState.password.length >= 6,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formState.password),
      hasNumber: /\d/.test(formState.password),
      hasUpperCase: /[A-Z]/.test(formState.password),
    });
  }, [formState.password, formState.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showToast("Invalid registration token", "error");
      return;
    }
    
    if (!validateForm()) {
      showToast("Please fix the form errors before continuing", "error");
      return;
    }
    
    try {
      await completeRegistration({
        token,
        password: formState.password,
      });
      
      // The hook handles successful registration by:
      // 1. Showing a success toast
      // 2. Storing user info and token
      // 3. Redirecting to dashboard
    } catch (error) {
      console.error("Registration completion failed:", error);
    }
  };
  
  const validateForm = (): boolean => {
    return (
      validations.passwordsMatch &&
      validations.passwordLength &&
      validations.hasSpecialChar &&
      validations.hasNumber &&
      validations.hasUpperCase
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
       
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set your password to activate your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Create a secure password"
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaKey className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  formState.confirmPassword && !validations.passwordsMatch
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm your password"
                value={formState.confirmPassword}
                onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
              />
              {formState.confirmPassword && !validations.passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Password requirements */}
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password requirements:</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center">
                {validations.passwordLength ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaExclamationCircle className="text-gray-400 mr-2" />
                )}
                At least 6 characters
              </li>
              <li className="flex items-center">
                {validations.hasUpperCase ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaExclamationCircle className="text-gray-400 mr-2" />
                )}
                At least one uppercase letter
              </li>
              <li className="flex items-center">
                {validations.hasNumber ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaExclamationCircle className="text-gray-400 mr-2" />
                )}
                At least one number
              </li>
              <li className="flex items-center">
                {validations.hasSpecialChar ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaExclamationCircle className="text-gray-400 mr-2" />
                )}
                At least one special character
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={registrationLoading || !validateForm()}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                validateForm() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {registrationLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;