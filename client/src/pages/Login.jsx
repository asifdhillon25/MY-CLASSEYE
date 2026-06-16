import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../redux/features/auth/authApi";
import { loginSuccess } from "../redux/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
     e.preventDefault();
  setError("");

  try {
    // RTK Query mutation
    const res = await login({ email, password }).unwrap();
    console.log("Login successful:", res);

     
 

    // res should be like: { token, user }
    dispatch(loginSuccess({ token: res.token, user: res.data.user }));

    // Navigate based on role
    navigate(`/app/${res.data.user.role}`);
  } catch (err) {
    console.log("Login error:", err);
    setError(
      err?.data?.message || err?.error || "Invalid email or password"
    );
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background px-4 transition-colors">
      <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl border border-light-border dark:border-dark-border overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-light-accentSoft dark:bg-dark-accentSoft">
          <h1 className="text-2xl font-bold text-light-accent dark:text-dark-accent text-center">
            ClassEye LMS
          </h1>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

          {error && (
            <div className="text-sm text-light-error dark:text-dark-error bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-light-border dark:border-dark-border bg-transparent px-3 py-2"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-light-border dark:border-dark-border bg-transparent px-3 py-2"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-light-primary dark:bg-dark-primary text-white py-2.5 font-semibold disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center text-xs text-light-textMuted dark:text-dark-textMuted">
          © {new Date().getFullYear()} ClassEye LMS
        </div>
      </div>
    </div>
  );
};

export default Login;
