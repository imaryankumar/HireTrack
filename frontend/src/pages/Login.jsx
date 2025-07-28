import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstence";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    status: "active",
  });
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const resetFormFields = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      status: "active",
    });
  };
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onLoginHanlder = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.", {
        id: "email-err",
      });
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        id: "password-err",
      });
      setLoading(false);
      return;
    }

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          ...formData,
        };

    try {
      const { data } = await axiosInstance.post(
        `/user/${isLogin ? "login" : "signup"}`,
        payload
      );
      if (data?.success) {
        resetFormFields();
        setLoading(false);
        toast.success(
          isLogin ? "Login Successful ✅" : "Signup Successful 🎉",
          {
            id: "success",
          }
        );
        if (isLogin && data.token) {
          console.log("data", data.user);
          login(data.token, data.user || formData.username);
          navigate("/");
        }
      } else {
        toast.error(isLogin ? "Login Failed ❌" : "Signup Failed ❌", {
          id: "failed",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: "error",
      });
      console.error("Auth Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        {/* Toggle */}
        <div className="w-full bg-transparent text-center pb-4">
          <img
            src="/HireTrack.png"
            alt="logo"
            className="mx-auto h-16 mix-blend-multiply w-auto object-contain"
          />
        </div>
        <div className="flex justify-center mb-6 relative">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-xl font-semibold transition-colors ${
              isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 cursor-pointer"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-xl font-semibold transition-colors ${
              !isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 cursor-pointer"
            }`}
          >
            Signup
          </button>
        </div>

        <form className="space-y-4" onSubmit={onLoginHanlder}>
          {/* Signup-only fields */}
          {!isLogin && (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 w-full border px-3 py-2 rounded-md bg-white"
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  defaultValue="active"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                  <option value="pending">Pending</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              minLength={6}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.password && (
              <div
                className="absolute top-9 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Loading.." : isLogin ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
