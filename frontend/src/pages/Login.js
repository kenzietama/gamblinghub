import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Tambah ikon
import loginImage from "../Picture/logogamblinghub.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk show/hide

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setPesan("Email dan password harus diisi.");
      return;
    }

    if (password.length < 6) {
      setPesan("Password Salah.");
      return;
    }

    setPesan(`Login berhasil! Selamat bermain.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white px-4">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Login
          </button>
        </form>

        {pesan && (
          <div className="mt-4 text-indigo-200 text-center text-sm">{pesan}</div>
        )}

        <div className="mt-6 text-center text-sm text-indigo-300">
          Auto Dashboard{" "}
          <Link to=".Pemain/Dashboard" className="text-indigo-400 underline hover:text-indigo-200">
            Daftar di sini
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-indigo-300">
          Belum punya akun?{" "}
          <Link to="./Register" className="text-indigo-400 underline hover:text-indigo-200">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
