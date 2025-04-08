import React, { useState } from "react";

const TebakAngka = () => {
  const [angkaTebakan, setAngkaTebakan] = useState("");
  const [angkaRahasia, setAngkaRahasia] = useState(generateRandom4Digit());
  const [saldo, setSaldo] = useState(100);
  const [pesan, setPesan] = useState("");

  // Generate angka acak 4 digit dari 0–9 (misal: 3921)
  function generateRandom4Digit() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
  }

  const handleTebak = () => {
    if (angkaTebakan.length !== 4 || saldo <= 0) {
      setPesan("❗ Masukkan 4 angka!");
      return;
    }

    if (angkaTebakan === angkaRahasia) {
      setSaldo((s) => s + 100);
      setPesan(`🎉 Tebakan tepat! Kamu menang 100 koin! 🎊 (${angkaRahasia})`);
    } else {
      setSaldo((s) => s - 20);
      setPesan(`❌ Tebakan salah. Jawaban: ${angkaRahasia}. -20 koin.`);
    }

    // reset angka baru & input
    setAngkaRahasia(generateRandom4Digit());
    setAngkaTebakan("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
      <div className="bg-black bg-opacity-70 rounded-3xl p-8 w-full max-w-md border-4 border-indigo-500 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-indigo-300 mb-4">🔢 Tebak 4 Angka (0000–9999)</h1>

        <div className="mb-4 text-lg">
          <span className="text-indigo-400">Saldo: </span>
          <span className="font-semibold">💰 {saldo} koin</span>
        </div>

        <input
          type="text"
          value={angkaTebakan}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // hanya angka
            if (value.length <= 4) setAngkaTebakan(value);
          }}
          className="w-full p-3 text-black text-lg rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Masukkan 4 angka (cth: 1234)"
        />

        <button
          onClick={handleTebak}
          className={`w-full py-3 rounded-xl font-bold text-white text-xl ${
            saldo <= 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          disabled={saldo <= 0}
        >
          🎯 Tebak Sekarang!
        </button>

        {pesan && <div className="mt-4 text-indigo-200 text-lg">{pesan}</div>}
      </div>
    </div>
  );
};

export default TebakAngka;
