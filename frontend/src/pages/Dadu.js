// pages/Dadu.js
import React, { useState } from "react";

const Dadu = () => {
  const [saldo, setSaldo] = useState(100);
  const [dadu1, setDadu1] = useState(1);
  const [dadu2, setDadu2] = useState(1);
  const [pesan, setPesan] = useState("");

  const rollDadu = () => {
    if (saldo < 10) return;

    const hasil1 = Math.floor(Math.random() * 6) + 1;
    const hasil2 = Math.floor(Math.random() * 6) + 1;
    const total = hasil1 + hasil2;

    setDadu1(hasil1);
    setDadu2(hasil2);

    if (total > 8) {
      setSaldo((s) => s + 30);
      setPesan(`🎉 Total ${total}! Kamu menang +30 koin!`);
    } else {
      setSaldo((s) => s - 10);
      setPesan(`💥 Total ${total}. Kurang dari 9, kamu kalah -10 koin.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-black text-white p-6">
      <div className="bg-black bg-opacity-80 rounded-3xl p-8 w-full max-w-md border-4 border-purple-400 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-purple-300 mb-4">🎲 Lempar Dadu</h1>

        <div className="mb-4 text-lg">
          Saldo: <span className="font-semibold">💰 {saldo} koin</span>
        </div>

        <div className="flex justify-center gap-8 text-5xl mb-6">
          <div>🎲 {dadu1}</div>
          <div>🎲 {dadu2}</div>
        </div>

        <button
          onClick={rollDadu}
          disabled={saldo < 10}
          className={`w-full py-3 rounded-xl font-bold text-white text-xl ${
            saldo < 10
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          🎲 Lempar Dadu!
        </button>

        {pesan && <div className="mt-4 text-purple-200 text-lg">{pesan}</div>}
      </div>
    </div>
  );
};

export default Dadu;
