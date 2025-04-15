import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import {useDataStore} from "../../store/useDataStore";
import {useGameStore} from "../../store/useGameStore";

const simbolJackpot = ["🍒", "🍋", "🔔", "⭐", "🍀", "💎", "7️⃣"];

const JackpotGame = () => {
  const [saldo, setSaldo] = useState(0);
  const [hasil, setHasil] = useState(["❓", "❓", "❓"]);
  const [pesan, setPesan] = useState("");
  const [spinning, setSpinning] = useState(false);

  const {getUserBalance, isLoading} = useDataStore();
  const {setBet, updateBalance, isUpdatingBalance, playJackpot, saveJackpotHistory, setResult} = useGameStore()

  const spin = async () => {
    if (saldo < 10000 || spinning) return;

    const {menang} = await playJackpot();

    setBet(10000);
    setSpinning(true);
    setSaldo(saldo - 10000);
    setPesan("🎲 Memutar...");

    setTimeout(() => {
      let gulungan;
      let isJackpot;

      if(menang === -1) {
        isJackpot = Math.random() < 0.1 //10% chance
        if (isJackpot) {
          setResult(1)
        }
      } else if (menang === 0) {
        isJackpot = false
      } else if (menang === 1) {
        isJackpot = true
      }
      // const isJackpot = menang === 1 ? true : Math.random() < 0.1; // 10% chance

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
        updateBalance(true);

        setSaldo((prev) => prev + 10000);
        setPesan("🎉 JACKPOT! Kamu menang 10000 koin!");
      } else {
        updateBalance(false);
        setPesan("😢 Belum beruntung, coba lagi!");
      }

      saveJackpotHistory()
      setSpinning(false);
    }, 1500);
  };

  const formatUang = (angka) => {
    if (!angka) return "";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchSaldo = async () => {
    try {
      const res = await getUserBalance();
      setSaldo(res.saldo);
    } catch (error) {
      console.error("Error fetching saldo:", error);
    }
  };

  useEffect(() => {
    fetchSaldo();
  }, [isUpdatingBalance]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
      <div className="bg-[#1e1a18] rounded-2xl shadow-2xl p-10 max-w-xl w-full border border-yellow-900">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 drop-shadow-lg">🎰 Jackpot Game</h1>

        <div className="flex justify-between mb-4 text-yellow-300 font-medium">
          <span>Saldo:</span>
          <span className="text-yellow-200 font-bold">
          Saldo: 💰
          {isUpdatingBalance || isLoading
              ? "Loading..."
              : saldo ? ` ${formatUang(saldo)} koin` : "Loading..."
          }
          </span>
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
          {spinning ? "🎲 Memutar..." : "🎯 SPIN (10000 koin)"}
        </button>

        {pesan && (
          <div className="mt-4 text-yellow-100 text-center font-medium">{pesan}</div>
        )}
      </div>
    </div>
  );
};

export default JackpotGame;
