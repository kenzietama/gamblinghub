import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {useDataStore} from "../../store/useDataStore";
import {useGameStore} from "../../store/useGameStore";

const kartuDeck = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const jenis = ["♠", "♥", "♦", "♣"];

const formatUang = (angka) => {
  if (!angka) return "";
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseUang = (str) => {
  return parseInt(str.replace(/\./g, ""), 10) || 0;
};

const BlackjackGame = () => {
  const [saldo, setSaldo] = useState(0);
  const [taruhan, setTaruhan] = useState("");
  const [currentTaruhan, setCurrentTaruhan] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [pesan, setPesan] = useState("");
  const [dealerTurn, setDealerTurn] = useState(false);

  const { getUserBalance, isLoading } = useDataStore();
  const {setBet, updateBalance, isUpdatingBalance} = useGameStore()

  const getRandomCard = () => {
    const angka = kartuDeck[Math.floor(Math.random() * kartuDeck.length)];
    const simbol = jenis[Math.floor(Math.random() * jenis.length)];
    return `${angka}${simbol}`;
  };

  const getCardValue = (card) => {
    const value = card.slice(0, -1);
    if (value === "A") return 11;
    if (["J", "Q", "K"].includes(value)) return 10;
    return parseInt(value, 10);
  };

  const hitungTotal = (cards) => {
    let total = cards.reduce((sum, c) => sum + getCardValue(c), 0);
    let aceCount = cards.filter((c) => c.startsWith("A")).length;
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  };

  const startGame = () => {
    const nilaiTaruhan = parseUang(taruhan);
    if (!nilaiTaruhan || nilaiTaruhan <= 0) {
      setPesan("❌ Masukkan taruhan yang valid.");
      return;
    }

    if (nilaiTaruhan < 10000) {
      setPesan("❌ Minimal taruhan adalah 10.000 koin.");
      return;
    }

    if (nilaiTaruhan > 1000000) {
      setPesan("❌ Maksimal taruhan adalah 1.000.000 koin.");
      return;
    }

    if (nilaiTaruhan > saldo) {
      setPesan("❌ Saldo tidak mencukupi untuk taruhan ini.");
      return;
    }

    setBet(nilaiTaruhan)
    setSaldo((s) => s - nilaiTaruhan);
    setCurrentTaruhan(nilaiTaruhan);
    setPlayerCards([getRandomCard(), getRandomCard()]);
    setDealerCards([getRandomCard()]);
    setGameStarted(true);
    setDealerTurn(false);
    setPesan("");
  };

  const tambahKartu = () => {
    const newCard = getRandomCard();
    const newCards = [...playerCards, newCard];
    setPlayerCards(newCards);
    const total = hitungTotal(newCards);
    if (total > 21) {
      setPesan("💥 Kamu bust! Kartu lebih dari 21.");
      updateBalance()
      setTimeout(() => resetGame(), 3000);
      setGameStarted(false);
    }
  };

  const selesai = async () => {
    setDealerTurn(true);
    let dealer = [...dealerCards];

    while (hitungTotal(dealer) < 17) {
      await new Promise((r) => setTimeout(r, 1000));
      dealer.push(getRandomCard());
      setDealerCards([...dealer]);
    }

    const playerTotal = hitungTotal(playerCards);
    const dealerTotal = hitungTotal(dealer);

    if (playerTotal > 21) {
      setPesan("💥 Kamu bust! Kartu lebih dari 21.");
      updateBalance()
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
      setSaldo((s) => s + currentTaruhan * 2);
      setPesan(`🎉 Kamu menang! +${formatUang(currentTaruhan * 2)} koin`);
      updateBalance(true)
    } else if (playerTotal === dealerTotal) {
      setSaldo((s) => s + currentTaruhan);
      setPesan("🤝 Seri. Taruhan dikembalikan.");
      setBet(0)
    } else {
      setPesan("😢 Kamu kalah.");
      updateBalance()
    }

    setGameStarted(false);
    setTimeout(() => resetGame(), 4000);
    fetchSaldo();
  };

  const resetGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setTaruhan("");
    setCurrentTaruhan(0);
    setDealerTurn(false);
    setPesan("");
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
      <div className="bg-black bg-opacity-80 p-8 rounded-2xl max-w-2xl w-full border-4 border-yellow-400 shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-300 mb-4 text-center">♠️ Blackjack Remi</h1>

        <div className="mb-4 text-lg text-center">
          Saldo: 💰
          {isUpdatingBalance || isLoading
              ? "Loading..."
              : saldo ? ` ${formatUang(saldo)} koin` : "Loading..."
          }
        </div>

        <div className="mb-4">
          <label className="block text-left mb-1 font-medium">🎯 Taruhan</label>
          <input
            type="text"
            value={taruhan}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setTaruhan(formatUang(raw));
            }}
            disabled={gameStarted}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-500"
            placeholder="Masukkan jumlah taruhan"
          />
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={startGame}
            disabled={gameStarted}
            className="px-4 py-2 bg-yellow-500 disabled:bg-yellow-700 hover:bg-yellow-400 rounded-xl text-black font-bold"
          >
            🎮 Mulai Game
          </button>
          <button
            onClick={tambahKartu}
            disabled={!gameStarted}
            className="px-4 py-2 bg-blue-600 disabled:bg-blue-800 hover:bg-blue-500 rounded-xl font-bold"
          >
            Hit
          </button>
          <button
            onClick={selesai}
            disabled={!gameStarted}
            className="px-4 py-2 bg-red-600 disabled:bg-red-800 hover:bg-red-500 rounded-xl font-bold"
          >
            Stand
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center">🧑 Pemain:</h2>
          <div className="flex gap-2 flex-wrap justify-center min-h-[90px]">
            {playerCards.map((card, i) => (
              <motion.div
                key={i}
                className="bg-white text-black rounded-lg px-3 py-2 shadow-md text-xl font-bold"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {card}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center">🤖 Dealer:</h2>
          <div className="flex gap-2 flex-wrap justify-center min-h-[90px]">
            {dealerCards.map((card, i) => (
              <motion.div
                key={i}
                className="bg-white text-black rounded-lg px-3 py-2 shadow-md text-xl font-bold"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {card}
              </motion.div>
            ))}
          </div>
        </div>

        {pesan && (
          <div className="mt-4 text-yellow-200 font-semibold text-center text-lg">{pesan}</div>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;