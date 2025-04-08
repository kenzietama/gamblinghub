import React from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: "🎰 Jackpot",
      desc: "Coba keberuntunganmu di mesin jackpot!",
      path: "/jackpot",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      name: "🔢 Tebak Angka",
      desc: "Tebak angka 4 digit dan menangkan hadiah!",
      path: "/tebak-angka",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      name: "🎴 Suit Jepang",
      desc: "Main suit lawan bot dan raih koin!",
      path: "/suit-jepang",
      color: "from-pink-400 to-pink-600",
    },
    {
      name: "🎲 Lempar Dadu",
      desc: "Lempar dadu dan menang bila jumlahnya besar!",
      path: "/dadu",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "🐎 Balap Kuda",
      desc: "Pilih kuda favoritmu dan lihat siapa juara!",
      path: "/balap-kuda",
      color: "from-green-400 to-green-600",
    },
    {
      name: "🃏 Blackjack",
      desc: "Kalahkan dealer di permainan blackjack!",
      path: "/blackjack",
      color: "from-blue-400 to-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col items-center">
      <div className="w-full flex justify-between max-w-4xl mb-6">
        <h1 className="text-3xl font-bold text-indigo-300">🎮 Menu Permainan</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          Login
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {games.map((game, index) => (
          <div
            key={index}
            onClick={() => navigate(game.path)}
            className={`cursor-pointer bg-gradient-to-br ${game.color} rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300`}
          >
            <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
            <p className="text-sm opacity-90">{game.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
