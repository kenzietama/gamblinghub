import React, { useState } from "react";

const generateRandom4Digit = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
};

const formatUang = (value) => {
  if (!value) return "";
  return parseInt(value).toLocaleString("id-ID");
};

const parseUang = (formatted) => {
  return parseInt(formatted.replace(/\./g, "")) || 0;
};

const TebakAngka = () => {
  const [angkaRahasia, setAngkaRahasia] = useState(generateRandom4Digit());
  const [isRevealed, setIsRevealed] = useState(false);
  const [saldo, setSaldo] = useState(1000000);
  const [pesan, setPesan] = useState("");
  const [peringatan, setPeringatan] = useState("");
  const [tebakanList, setTebakanList] = useState([
    { angka: "", taruhan: "", disabled: false }
  ]);

  const totalTaruhanSaatIni = () => {
    return tebakanList.reduce((acc, t) => acc + parseUang(t.taruhan || "0"), 0);
  };

  const handleInputChange = (index, field, value) => {
    const newList = [...tebakanList];
    if (newList[index].disabled) return;

    if (field === "angka") {
      newList[index][field] = value.replace(/\D/g, "").slice(0, 4);
    } else {
      newList[index][field] = value.replace(/\D/g, "");
    }

    setTebakanList(newList);

    const totalBaru = newList.reduce((acc, t) => acc + parseUang(t.taruhan || "0"), 0);
    if (totalBaru > saldo) {
      setPeringatan("⚠️ Total taruhan melebihi saldo.");
    } else {
      setPeringatan("");
    }
  };

  const tambahSetTebakan = () => {
    const last = tebakanList[tebakanList.length - 1];
    const currentTotal = totalTaruhanSaatIni();

    if (tebakanList.length >= 5) return;
    if (!last.angka || !last.taruhan) return;

    const bet = parseUang(last.taruhan);

    if (currentTotal > saldo) {
      setPeringatan("⚠️ Tidak bisa tambah set baru, total taruhan melebihi saldo.");
      return;
    }

    const updatedList = [...tebakanList];
    updatedList[updatedList.length - 1].disabled = true;
    updatedList.push({ angka: "", taruhan: "", disabled: false });

    setTebakanList(updatedList);
    setPeringatan("");
  };

  const handleTebak = () => {
    let totalBet = 0;
    let reward = 0;
    let message = "";

    tebakanList.forEach(({ angka, taruhan }, i) => {
      const bet = parseUang(taruhan || "0");

      if (angka.length === 4 && bet > 0) {
        totalBet += bet;
        if (angka === angkaRahasia) {
          reward += bet * 2;
          message += `✅ Set ${i + 1} BENAR! +${formatUang(bet * 2)} koin\n`;
        } else {
          message += `❌ Set ${i + 1} salah. -${formatUang(bet)} koin\n`;
        }
      }
    });

    if (totalBet > saldo) {
      setPesan("❗ Total taruhan melebihi saldo!");
      return;
    }

    setSaldo((s) => s - totalBet + reward);
    setIsRevealed(true);
    setPesan(message || "⚠️ Tidak ada tebakan valid.");

    setTimeout(() => {
      setAngkaRahasia(generateRandom4Digit());
      setIsRevealed(false);
      setTebakanList([{ angka: "", taruhan: "", disabled: false }]);
      setPeringatan("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-indigo-300 mb-4">🎯 Tebak Angka Rahasia</h1>

      <div className="text-xl mb-2">
        <span className="text-indigo-400">Saldo: </span>
        💰 {formatUang(saldo)} koin
      </div>

      {peringatan && (
        <div className="text-yellow-300 mb-4 text-sm bg-yellow-900 bg-opacity-30 p-2 rounded">
          {peringatan}
        </div>
      )}

      <div className="flex gap-2 mb-6 text-2xl">
        {isRevealed
          ? angkaRahasia.split("").map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-indigo-700 rounded flex items-center justify-center font-bold border-2 border-white"
              >
                {digit}
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center font-bold border-2 border-white"
              >
                ❓
              </div>
            ))}
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 mb-4">
        {tebakanList.map((tebakan, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={tebakan.angka}
              onChange={(e) => handleInputChange(index, "angka", e.target.value)}
              disabled={tebakan.disabled}
              className="w-32 p-2 text-center text-black text-lg rounded"
              placeholder="4 digit"
            />
            <input
              type="text"
              value={formatUang(tebakan.taruhan)}
              onChange={(e) =>
                handleInputChange(index, "taruhan", e.target.value.replace(/\D/g, ""))
              }
              disabled={tebakan.disabled}
              className="flex-1 p-2 text-center text-black text-lg rounded"
              placeholder="Taruhan"
            />
          </div>
        ))}
      </div>

      {tebakanList.length < 5 && (
        <button
          onClick={tambahSetTebakan}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
        >
          ➕ Tambah Set Tebakan
        </button>
      )}

      <button
        onClick={handleTebak}
        className={`w-full max-w-md py-3 rounded-xl font-bold text-white text-xl ${
          saldo <= 0 ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
        }`}
        disabled={saldo <= 0}
      >
        🚀 Kirim Tebakan
      </button>

      {pesan && (
        <pre className="mt-4 bg-indigo-800 bg-opacity-40 p-4 rounded-lg whitespace-pre-wrap text-sm text-indigo-200">
          {pesan}
        </pre>
      )}
    </div>
  );
};

export default TebakAngka;
