import {  EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { signupSchema} from "../../schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomeInput from "../components/CustsomInput";
import { useSignup } from "../hooks/auth";
import { SignupData } from "../services/auth/type"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted] = useState(false);
  const navigate = useNavigate();
  const { signup, signupLoading, signupSuccess } = useSignup();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
    mode: "onChange",
  });
  // Watch password for strength indicator
  const password = watch("password");
  const passwordStrength = getPasswordStrength(password);

  // Handle successful signup
  useEffect(() => {
    if (signupSuccess && formSubmitted) {
      // Reset form after successful submission
      reset();
      // Redirect to login page or dashboard after short delay
      const timer = setTimeout(() => {
        navigate("/verify", {
          state: { message: "Please verify your email" },
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [signupSuccess, formSubmitted, reset, navigate]);

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    const dataToSend = { ...data, role: "customer" };
    await signup(dataToSend);
  };
  // Password strength calculation
  function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
  } {
    if (!password) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const strengthMap = [
      { score: 0, label: "None", color: "bg-gray-200" },
      { score: 1, label: "Weak", color: "bg-red-500" },
      { score: 2, label: "Fair", color: "bg-orange-500" },
      { score: 3, label: "Good", color: "bg-yellow-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
    ];

    return strengthMap[score];
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
   
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <CustomeInput
                      label="First Name"
                      type="text"
                      id="firstName"
                      placeholder="Enter First Name"
                      field={field}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <CustomeInput
                      label="Last Name"
                      type="text"
                      id="lastName"
                      placeholder="Enter Last Name"
                      field={field}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CustomeInput
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="Enter Email address"
                    field={field}
                    error={errors.email?.message}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <CustomeInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        field={field}
                        placeholder="Enter Password"
                        error={errors.password?.message}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6 text-gray-400 hover:text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-600 mb-1">
                          Password strength: {passwordStrength.label}
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color}`}
                            style={{
                              width: `${(passwordStrength.score / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <ul className="text-xs text-gray-500 mt-2 space-y-1 pl-5 list-disc">
                          <li
                            className={
                              password.length >= 8 ? "text-green-600" : ""
                            }
                          >
                            At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(password) ? "text-green-600" : ""
                            }
                          >
                            At least one uppercase letter
                          </li>
                          <li
                            className={
                              /[0-9]/.test(password) ? "text-green-600" : ""
                            }
                          >
                            At least one number
                          </li>
                          <li
                            className={
                              /[^A-Za-z0-9]/.test(password)
                                ? "text-green-600"
                                : ""
                            }
                          >
                            At least one special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <CustomeInput
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      field={field}
                      error={errors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6 text-gray-400 hover:text-gray-500"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}
              />
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={signupLoading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {signupLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;