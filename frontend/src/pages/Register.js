// pages/Register.js
import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import registerImage from "../Picture/logogamblinghub.png"; // Gambar yang sama atau berbeda sesuai kebutuhan
import {useAuthStore} from "../store/useAuthStore";
import toast from "react-hot-toast";
import {Eye, EyeOff, Loader2} from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const {register, isRegistering} = useAuthStore()

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password) {
      return toast.error("Semua field harus diisi.");
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Format email tidak sesuai.");
    }

    if (formData.password.length < 8) {
        return toast.error("Password minimal 8 karakter.");
    }

    if (!isAdult) {
        return toast.error("Anda harus menyatakan bahwa Anda berumur lebih dari 18 tahun.");
    }

    return true;
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const clear = validateForm();

    if (clear === true) {
      await register(formData, navigate);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white px-4">
      <div className="bg-black bg-opacity-70 p-8 rounded-3xl w-full max-w-md shadow-2xl border-4 border-indigo-600">
        
        {/* Gambar Header */}
        <img
          src={registerImage}
          alt="Register Icon"
          className="mx-auto mb-6 w-18 h-24 object-contain"
        />

        <form onSubmit={handleRegister} className="space-y-4">
          <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 pr-12 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-indigo-600"
            >
              {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                id="ageCheck"
            />
            <label htmlFor="ageCheck" className="text-sm text-indigo-300">
              Saya menyatakan bahwa saya berusia lebih dari 18 tahun.
            </label>
          </div>

          <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 text-xl font-bold rounded-xl"
              disabled={isRegistering}
          >
            {isRegistering ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
            ) : (
                "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-indigo-300">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-indigo-400 underline hover:text-indigo-200">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
