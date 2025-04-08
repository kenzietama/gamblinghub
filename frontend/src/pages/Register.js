// pages/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import registerImage from "../Picture/logogamblinghub.png"; // Gambar yang sama atau berbeda sesuai kebutuhan

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !username || !password) {
      setPesan("Semua field harus diisi.");
      return;
    }

    if (password.length < 8) {
      setPesan("Password minimal 8 karakter.");
      return;
    }

    if (!isAdult) {
      setPesan("Anda harus menyatakan bahwa Anda berumur lebih dari 18 tahun.");
      return;
    }

    setPesan(`Registrasi berhasil! Selamat datang, ${username}.`);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

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
          >
            Register
          </button>
        </form>

        {pesan && (
          <div className="mt-4 text-indigo-200 text-center text-sm">{pesan}</div>
        )}

        <div className="mt-6 text-center text-sm text-indigo-300">
          Sudah punya akun?{" "}
          <Link to="/" className="text-indigo-400 underline hover:text-indigo-200">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
