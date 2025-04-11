import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Eye, EyeOff, Loader2} from "lucide-react";
import loginImage from "../Picture/logogamblinghub.png";
import {useAuthStore} from "../store/useAuthStore";
import toast from "react-hot-toast"; // pastikan path-nya benar

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {login, isLoggingIn} = useAuthStore()

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      await login(formData, navigate);
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">
        <div className="bg-black bg-opacity-70 p-8 rounded-3xl w-full max-w-md shadow-2xl border-4 border-indigo-600">
        <img
          src={loginImage}
          alt="Login Icon"
          className="mx-auto mb-6 w-18 h-24 object-contain"
        />

        <form onSubmit={handleLogin} className="space-y-4">
          <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 pr-12 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-indigo-600"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 text-xl font-bold rounded-xl"
          >
            {isLoggingIn ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
            ) : (
                "Login"
            )}
          </button>

          <button
              type="button"
            onClick={() => navigate("/")}
            className="w-full bg-red-600 hover:bg-indigo-500 transition py-3 text-xl font-bold rounded-xl"
          >
            Kembali
          </button>

        </form>
        <div className="mt-6 text-center text-sm text-indigo-300">
          Belum punya akun?{" "}
          <Link to="/register" className="text-indigo-400 underline hover:text-indigo-200">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
