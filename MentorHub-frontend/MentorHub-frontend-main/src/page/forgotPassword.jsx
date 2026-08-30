import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import auth from "../apiManger/auth";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await auth.forgotPassword(data);
      // Always show the same success state, whether or not the email exists,
      // so we don't leak which emails are registered.
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
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
                Reset your password to get back into your account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Forgot password?
              </h2>
              <p className="mt-3 text-gray-500">
                Enter your email and we'll send you a link to reset it.
              </p>
            </div>

            <div className="mt-8">
              {submitted ? (
                <div className="p-4 text-sm text-center text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  If an account exists for that email, a password reset link
                  has been sent. Check your inbox (and spam folder).
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600 "
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="example@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
