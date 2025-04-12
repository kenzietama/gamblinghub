import React, { useState } from "react";

const formatUang = (value) => {
  if (!value) return "";
  return parseInt(value).toLocaleString("id-ID");
};

const TebakAngkaAdmin = () => {
  const [angkaRahasia, setAngkaRahasia] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [historyPemenang, setHistoryPemenang] = useState([]);

  const [pemainList, setPemainList] = useState([
    {
      email: "udin@example.com",
      username: "Udin123",
      tebakan: "1234",
      taruhan: 20000,
    },
    {
      email: "sari@example.com",
      username: "SariKeren",
      tebakan: "5678",
      taruhan: 30000,
    },
    {
      email: "agus@example.com",
      username: "Agus99",
      tebakan: "4321",
      taruhan: 15000,
    },
  ]);

  const handleReveal = () => {
    if (angkaRahasia.length !== 4 || isNaN(angkaRahasia)) return;

    const pemenangBaru = pemainList
      .filter((p) => p.tebakan === angkaRahasia)
      .map((p) => ({
        ...p,
        angkaRahasia,
        reward: p.taruhan * 2,
      }));

    setHistoryPemenang((prev) => [...prev, ...pemenangBaru]);
    setIsRevealed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        Panel Admin - Tebak Angka
      </h1>

      <div className="max-w-xl mx-auto bg-gray-800 p-4 rounded-lg mb-6">
        <label className="block mb-2 text-indigo-300 font-semibold">
          Angka Rahasia (4 digit)
        </label>
        <input
          type="text"
          value={angkaRahasia}
          onChange={(e) => setAngkaRahasia(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-full p-2 rounded text-black text-lg text-center"
          placeholder="Misal: 1234"
        />
        <button
          onClick={handleReveal}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-bold"
        >
          Tampilkan Angka ke Pemain
        </button>
      </div>

      {isRevealed && (
        <div className="text-center mb-6 text-xl text-green-400 font-bold">
          Angka Rahasia: {angkaRahasia}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Daftar Pemain</h2>
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="text-indigo-400 border-b border-indigo-700">
              <th className="py-2">Email</th>
              <th>Username</th>
              <th>Angka Tebakan</th>
              <th>Taruhan</th>
              <th>Hasil</th>
            </tr>
          </thead>
          <tbody>
            {pemainList.map((pemain, i) => {
              const menang = isRevealed && pemain.tebakan === angkaRahasia;
              return (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-2">{pemain.email}</td>
                  <td>{pemain.username}</td>
                  <td className="text-center">{pemain.tebakan}</td>
                  <td className="text-right">{formatUang(pemain.taruhan)} koin</td>
                  <td className="text-center">
                    {isRevealed ? (menang ? "✅ Menang" : "❌ Kalah") : "⏳"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {historyPemenang.length > 0 && (
        <div className="max-w-3xl mx-auto bg-gray-800 mt-8 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Riwayat Pemenang</h2>
            <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
                <thead>
                <tr className="text-green-400 border-b border-green-700 bg-gray-700">
                    <th className="w-10 py-2 text-center">#</th>
                    <th className="w-1/5 px-2 text-left">Email</th>
                    <th className="w-1/6 px-2 text-left">Username</th>
                    <th className="w-1/6 px-2 text-center">Tebakan</th>
                    <th className="w-1/6 px-2 text-right">Taruhan</th>
                    <th className="w-1/6 px-2 text-right">Reward</th>
                    <th className="w-1/6 px-2 text-center">Angka Rahasia</th>
                </tr>
                </thead>
                <tbody>
                {historyPemenang.map((pemenang, i) => (
                    <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                    >
                    <td className="py-2 text-center">{i + 1}</td>
                    <td className="px-2">{pemenang.email}</td>
                    <td className="px-2">{pemenang.username}</td>
                    <td className="px-2 text-center">{pemenang.tebakan}</td>
                    <td className="px-2 text-right">{formatUang(pemenang.taruhan)} koin</td>
                    <td className="px-2 text-right text-yellow-300 font-bold">
                        +{formatUang(pemenang.reward)} koin
                    </td>
                    <td className="px-2 text-center text-green-400">{pemenang.angkaRahasia}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        )}
    </div>
  );
};

export default TebakAngkaAdmin;
