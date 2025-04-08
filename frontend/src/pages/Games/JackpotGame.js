import React, { useState } from "react";
import { motion } from "framer-motion";

const simbolJackpot = ["🍒", "🍋", "🔔", "⭐", "🍀", "💎", "7️⃣"];

const JackpotGame = () => {
  const [saldo, setSaldo] = useState(100);
  const [hasil, setHasil] = useState(["❓", "❓", "❓"]);
  const [pesan, setPesan] = useState("");
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (saldo < 10 || spinning) return;

    setSpinning(true);
    setSaldo(saldo - 10);
    setPesan("🎲 Memutar...");

    setTimeout(() => {
      let gulungan;
      const isJackpot = Math.random() < 0.9; // 🎯 90% kesempatan menang

      if (isJackpot) {
        const simbol = simbolJackpot[Math.floor(Math.random() * simbolJackpot.length)];
        gulungan = [simbol, simbol, simbol];
      } else {
        do {
          gulungan = Array(3)
            .fill()
            .map(() => simbolJackpot[Math.floor(Math.random() * simbolJackpot.length)]);
        } while (gulungan[0] === gulungan[1] && gulungan[1] === gulungan[2]);
      }

      setHasil(gulungan);

      if (gulungan[0] === gulungan[1] && gulungan[1] === gulungan[2]) {
        setSaldo((prev) => prev + 100);
        setPesan("🎉 JACKPOT! Kamu menang 100 koin!");
      } else {
        setPesan("😢 Belum beruntung, coba lagi!");
      }

      setSpinning(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2017/08/30/07/52/slot-machine-2690292_1280.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-yellow-500 text-center backdrop-blur">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 glow-text drop-shadow-xl">
          🎰 JACKPOT MACHINE
        </h1>

        <div className="flex justify-between mb-4 text-yellow-300 font-semibold">
          <span>Saldo:</span>
          <span className="font-bold">💰 {saldo} koin</span>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 flex justify-center items-center gap-4 mb-6 shadow-inner border-2 border-yellow-400">
          {hasil.map((simbol, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center text-4xl shadow-xl border-4 border-yellow-400"
              animate={{ rotate: spinning ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {simbol}
            </motion.div>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={saldo < 10 || spinning}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all text-xl tracking-wide ${
            saldo < 10 || spinning
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400 hover:scale-105"
          }`}
        >
          {spinning ? "🎲 Memutar..." : "🎯 SPIN (10 koin)"}
        </button>

        {pesan && (
          <div className="mt-4 text-yellow-200 text-lg font-medium">{pesan}</div>
        )}
      </div>
    </div>
  );
};

export default JackpotGame;
