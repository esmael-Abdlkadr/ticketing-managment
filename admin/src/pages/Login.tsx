import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomeInput from "../components/ui/CustsomInput";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/zodSchema";
import { useLogin } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../services/auth/type";

function Login() {
  const { login, loginLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    await login(data, {
      onSuccess() {
        reset();
        navigate("/", { replace: true });
      },
      onError() {
        reset();
      },
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Login to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                )}
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Logging In....
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
