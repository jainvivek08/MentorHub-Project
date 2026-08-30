import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import auth from "../apiManger/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    if (!token) {
      toast.error("Reset link is invalid or missing a token.");
      return;
    }

    setIsLoading(true);
    try {
      await auth.resetPassword({ token, password: data.password });
      toast.success("Password reset successfully. Please sign in.");
      navigate("/signin");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Reset link is invalid or has expired."
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="bg-white ">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-[url('https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover lg:block lg:w-2/3">
          <div className="flex items-center w-full h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                MentorHub
              </h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Choose a new password for your account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Reset password
              </h2>
              <p className="mt-3 text-gray-500">
                Enter a new password for your account.
              </p>
            </div>

            <div className="mt-8">
              {!token ? (
                <div className="p-4 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
                  This reset link is invalid or missing a token. Request a
                  new one from the{" "}
                  <NavLink to="/forgot-password" className="underline">
                    forgot password
                  </NavLink>{" "}
                  page.
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm text-gray-600 "
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="At least 8 characters"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters long",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm text-gray-600 "
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="Re-enter new password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isLoading ? "Resetting..." : "Reset password"}
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-6 text-sm text-center text-gray-400">
                Remembered your password?{" "}
                <NavLink
                  to="/signin"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Sign in
                </NavLink>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
