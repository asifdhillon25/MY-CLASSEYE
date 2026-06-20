import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../redux/features/auth/authApi";
import { loginSuccess } from "../redux/features/auth/authSlice";
import ClassEyeLogo from "../assets/SVG/Asset 1.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password }).unwrap();

      dispatch(loginSuccess({ token: res.token, user: res.data.user }));

      navigate(`/app/${res.data.user.role}`);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background transition-colors">
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* Left Branding Section */}
        <div className="hidden lg:flex relative overflow-hidden bg-light-accentSoft dark:bg-dark-accentSoft px-12 py-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-light-accent/20 dark:bg-dark-accent/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between w-full">
            <div className="flex items-center gap-3">
              <img src={ClassEyeLogo} alt="ClassEye Logo" className="h-12 w-12 object-contain" />
              <div>
                <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  ClassEye LMS
                </h2>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Smart learning management system
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold leading-tight text-light-textPrimary dark:text-dark-textPrimary">
                Manage classes, track learning, and connect your academic world.
              </h1>
              <p className="mt-5 text-base leading-7 text-light-textSecondary dark:text-dark-textSecondary">
                A modern LMS experience designed for students, teachers, and administrators.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-light-surface/70 dark:bg-dark-surface/70 border border-light-border dark:border-dark-border p-4">
                  <p className="text-2xl font-bold text-light-accent dark:text-dark-accent">24/7</p>
                  <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">Access</p>
                </div>
                <div className="rounded-2xl bg-light-surface/70 dark:bg-dark-surface/70 border border-light-border dark:border-dark-border p-4">
                  <p className="text-2xl font-bold text-light-accent dark:text-dark-accent">Live</p>
                  <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">Progress</p>
                </div>
                <div className="rounded-2xl bg-light-surface/70 dark:bg-dark-surface/70 border border-light-border dark:border-dark-border p-4">
                  <p className="text-2xl font-bold text-light-accent dark:text-dark-accent">Easy</p>
                  <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">Learning</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
              © {new Date().getFullYear()} ClassEye LMS. All rights reserved.
            </p>
          </div>
        </div>

        {/* Login Section */}
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <img src={ClassEyeLogo} alt="ClassEye Logo" className="h-16 w-16 object-contain mb-3" />
              <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                ClassEye LMS
              </h1>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface rounded-3xl shadow-xl border border-light-border dark:border-dark-border overflow-hidden">
              <div className="px-8 pt-8 pb-6">
                <div className="hidden lg:flex justify-center mb-5">
                  <div className="h-20 w-20 rounded-2xl bg-light-accentSoft dark:bg-dark-accentSoft flex items-center justify-center border border-light-border dark:border-dark-border">
                    <img src={ClassEyeLogo} alt="ClassEye Logo" className="h-14 w-14 object-contain" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-light-textPrimary dark:text-dark-textPrimary">
                  Welcome back
                </h2>
                <p className="text-sm text-center mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                  Sign in to access your ClassEye dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                {error && (
                  <div className="text-sm text-light-error dark:text-dark-error bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 text-light-textPrimary dark:text-dark-textPrimary placeholder:text-light-textMuted dark:placeholder:text-dark-textMuted outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1.5">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-light-border dark:border-dark-border bg-transparent px-4 py-3 pr-12 text-light-textPrimary dark:text-dark-textPrimary placeholder:text-light-textMuted dark:placeholder:text-dark-textMuted outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-light-textMuted dark:text-dark-textMuted hover:text-light-primary dark:hover:text-dark-primary transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.24A10.7 10.7 0 0112 4c5 0 9 4.5 10 8a11.8 11.8 0 01-3.22 5.12" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.1 6.1C4.12 7.43 2.72 9.54 2 12c1 3.5 5 8 10 8 1.54 0 2.98-.43 4.22-1.16" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary">
                    <input type="checkbox" className="rounded border-light-border dark:border-dark-border" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-medium text-light-primary dark:text-dark-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-light-primary dark:bg-dark-primary text-white py-3 font-semibold shadow-lg shadow-black/10 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? "Signing in..." : "Login to Dashboard"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-light-textMuted dark:text-dark-textMuted">
              Secure access for students, teachers, and administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;