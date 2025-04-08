import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">🎮 Selamat datang, Player!</h1>
        <p className="text-indigo-300 mb-8">Ayo mulai bermain dan raih skor tertinggi!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black bg-opacity-60 p-6 rounded-2xl border border-indigo-500 shadow-lg">
            <h2 className="text-xl font-semibold">Game Dimainkan</h2>
            <p className="text-3xl mt-2 font-bold text-indigo-400">7</p>
          </div>

          <div className="bg-black bg-opacity-60 p-6 rounded-2xl border border-indigo-500 shadow-lg">
            <h2 className="text-xl font-semibold">Skor Tertinggi</h2>
            <p className="text-3xl mt-2 font-bold text-indigo-400">9800</p>
          </div>

          <div className="bg-black bg-opacity-60 p-6 rounded-2xl border border-indigo-500 shadow-lg">
            <h2 className="text-xl font-semibold">Level Saat Ini</h2>
            <p className="text-3xl mt-2 font-bold text-indigo-400">15</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/games"
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-lg font-semibold transition"
          >
            🎲 Mainkan Game
          </Link>
          <Link
            to="/profile"
            className="bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-xl text-lg font-semibold transition"
          >
            👤 Profil
          </Link>
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl text-lg font-semibold transition"
          >
            🚪 Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
