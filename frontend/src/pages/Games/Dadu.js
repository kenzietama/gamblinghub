// pages/Dadu.js
import React, { useState } from "react";
import { motion } from "framer-motion";

const Dadu = () => {
  const [saldo, setSaldo] = useState(100);
  const [dadu1, setDadu1] = useState(1);
  const [dadu2, setDadu2] = useState(1);
  const [pesan, setPesan] = useState("");
  const [rolling, setRolling] = useState(false);

  const rollDadu = () => {
    if (saldo < 10 || rolling) return;

    setRolling(true);
    setPesan("🎲 Melempar dadu...");

    let count = 0;
    const interval = setInterval(() => {
      const random1 = Math.floor(Math.random() * 6) + 1;
      const random2 = Math.floor(Math.random() * 6) + 1;
      setDadu1(random1);
      setDadu2(random2);
      count++;

      if (count >= 10) {
        clearInterval(interval);
        const total = random1 + random2;

        if (total > 8) {
          setSaldo((s) => s + 30);
          setPesan(`🎉 Total ${total}! Kamu menang +30 koin!`);
        } else {
          setSaldo((s) => s - 10);
          setPesan(`💥 Total ${total}. Kurang dari atau sama dengan 8, kamu kalah -10 koin.`);
        }

        setRolling(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
      <div className="bg-black bg-opacity-80 rounded-3xl p-8 w-full max-w-md border-4 border-purple-400 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-purple-300 mb-4">🎲 Lempar Dadu</h1>

        <div className="mb-4 text-lg">
          Saldo: <span className="font-semibold">💰 {saldo} koin</span>
        </div>

        <div className="flex justify-center gap-8 text-6xl mb-6">
          {[dadu1, dadu2].map((angka, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                animate={rolling ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  repeat: rolling ? Infinity : 0,
                }}
                className="text-5xl"
              >
                🎲
              </motion.div>
              <div className="mt-1 text-4xl font-bold">{angka}</div>
            </div>
          ))}
        </div>

        <button
          onClick={rollDadu}
          disabled={saldo < 10 || rolling}
          className={`w-full py-3 rounded-xl font-bold text-white text-xl transition-all ${
            saldo < 10 || rolling
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500 hover:scale-105"
          }`}
        >
          {rolling ? "🎲 Melempar..." : "🎯 Lempar Dadu (10 koin)"}
        </button>

        {pesan && <div className="mt-4 text-purple-200 text-lg">{pesan}</div>}

        <div className="mt-6 text-sm text-purple-300 bg-purple-800 bg-opacity-30 p-4 rounded-xl border border-purple-500">
          <h2 className="font-semibold mb-2 underline">📜 Aturan Main:</h2>
          <ul className="list-disc text-left ml-6 space-y-1">
            <li>Setiap lemparan memotong 10 koin dari saldo.</li>
            <li>Jika jumlah dadu lebih dari 8, kamu menang dan dapat +30 koin.</li>
            <li>Jika total 8 atau kurang, kamu kalah dan saldo tetap berkurang 10 koin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dadu;
