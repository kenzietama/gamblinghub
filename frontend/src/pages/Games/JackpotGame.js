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
      const isJackpot = Math.random() < 0.1; // 10% chance

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
      <div className="bg-[#1e1a18] rounded-2xl shadow-2xl p-10 max-w-xl w-full border border-yellow-900">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 drop-shadow-lg">🎰 Jackpot Game</h1>

        <div className="flex justify-between mb-4 text-yellow-300 font-medium">
          <span>Saldo:</span>
          <span className="text-yellow-200 font-bold">💰 {saldo} koin</span>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          {hasil.map((simbol, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-yellow-100 to-yellow-300 text-5xl w-24 h-24 rounded-2xl flex items-center justify-center border-4 border-yellow-500 shadow-2xl ring-2 ring-yellow-300"
              animate={{ rotate: spinning ? 1080 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <span className="drop-shadow-md">{simbol}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={saldo < 10 || spinning}
          className={`w-full py-3 rounded-xl text-xl font-semibold transition-all ${
            saldo < 10 || spinning
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400 hover:scale-105"
          }`}
        >
          {spinning ? "🎲 Memutar..." : "🎯 SPIN (10 koin)"}
        </button>

        {pesan && (
          <div className="mt-4 text-yellow-100 text-center font-medium">{pesan}</div>
        )}
      </div>
    </div>
  );
};

export default JackpotGame;
