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
      name: "🎲 Lempar Dadu",
      desc: "Lempar dadu dan menang bila jumlahnya besar!",
      path: "/dadu",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "🃏 Blackjack",
      desc: "Kalahkan dealer di permainan blackjack!",
      path: "/blackjack",
      color: "from-blue-400 to-blue-600",
    },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Menu Permainan</h1>
            <p className="text-gray-300">Pilih permainan favoritmu dan raih kemenangan besar!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {games.map((game, index) => (
              <div
                key={index}
                onClick={() => navigate(game.path)}
                className={`cursor-pointer bg-gradient-to-br ${game.color} p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300`}
              >
                <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
                <p className="text-sm text-white/90">{game.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default MainMenu;
