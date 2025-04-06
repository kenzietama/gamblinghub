import React, { useState } from "react";
import { motion } from "framer-motion";

const kudaList = ["🐎 Kuda A", "🐎 Kuda B", "🐎 Kuda C"];

const HorseRaceDramatic = () => {
  const [saldo, setSaldo] = useState(100);
  const [pilihan, setPilihan] = useState(null);
  const [pemenang, setPemenang] = useState(null);
  const [hasil, setHasil] = useState("");
  const [balapan, setBalapan] = useState(false);
  const [animasiTrigger, setAnimasiTrigger] = useState(0);

  const mulaiBalapan = () => {
    if (saldo < 10 || pilihan === null || balapan) return;

    setSaldo((s) => s - 10);
    setBalapan(true);
    setHasil("");
    setPemenang(null);

    const winner = Math.floor(Math.random() * 3);
    setPemenang(winner);

    // Trigger ulang animasi kuda (pakai timestamp atau counter)
    setAnimasiTrigger(Date.now());

    // Akhiri balapan setelah animasi selesai
    setTimeout(() => {
      if (pilihan === winner) {
        setSaldo((s) => s + 30);
        setHasil(`🎉 ${kudaList[winner]} menang! +30 koin`);
      } else {
        setHasil(`😢 ${kudaList[winner]} menang. Kamu kalah.`);
      }
      setBalapan(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-80 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border-4 border-green-600 text-center">
        <h1 className="text-3xl font-extrabold text-green-400 mb-6 drop-shadow">
          🏇 Balap Kuda
        </h1>
        <div className="mb-4 text-lg">Saldo: 💰 {saldo} koin</div>

        <div className="mb-6">
          <p className="mb-2">Pilih kuda jagoanmu:</p>
          <div className="flex justify-center gap-4 text-lg">
            {kudaList.map((k, i) => (
              <button
                key={i}
                onClick={() => setPilihan(i)}
                className={`px-4 py-2 rounded-xl border-2 ${
                  pilihan === i
                    ? "bg-green-600 border-green-300"
                    : "bg-gray-800 border-gray-600"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Lintasan */}
        <div className="space-y-6 mb-8 mt-6">
          {kudaList.map((kuda, i) => (
            <div key={i} className="relative h-16 bg-gray-900 rounded-xl overflow-hidden border border-green-600">
              <motion.div
                key={`${i}-${animasiTrigger}`}
                className="absolute left-0 top-0 h-full flex items-center px-4 text-2xl"
                animate={{
                  x: "90%",
                }}
                transition={{
                  duration: i === pemenang ? 2.5 : 3 + Math.random(), // pemenang lebih cepat
                  ease: "easeInOut",
                }}
              >
                {kuda}
              </motion.div>
            </div>
          ))}
        </div>

        <button
          onClick={mulaiBalapan}
          disabled={saldo < 10 || balapan || pilihan === null}
          className={`w-full py-3 rounded-xl font-bold text-white text-xl ${
            saldo < 10 || balapan || pilihan === null
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          🎬 Mulai Balapan (10 koin)
        </button>

        {hasil && (
          <div className="mt-6 text-green-300 text-lg font-semibold">{hasil}</div>
        )}
      </div>
    </div>
  );
};

export default HorseRaceDramatic;
