import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulasi validasi sederhana
    if (!email || !username || !password) {
      setPesan("❗ Semua field harus diisi.");
      return;
    }

    if (password.length < 6) {
      setPesan("🔐 Password minimal 6 karakter.");
      return;
    }

    setPesan(`✅ Login berhasil! Selamat datang, ${username}.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white px-4">
      <div className="bg-black bg-opacity-70 p-8 rounded-3xl w-full max-w-md shadow-2xl border-4 border-indigo-600">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-300">🔐 Login Akun</h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
      </div>
    </div>
  );
};

export default LoginPage;
