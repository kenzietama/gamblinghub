import React, { useState } from "react";

const JackpotAdmin = () => {
  const [jumlahSet, setJumlahSet] = useState("");
  const [jumlahMenang, setJumlahMenang] = useState("");
  const [setPermainan, setSetPermainan] = useState([]);
  const [historyPemenang, setHistoryPemenang] = useState([]);

  const handleTambahSet = () => {
    const total = parseInt(jumlahSet);
    const menang = parseInt(jumlahMenang);

    if (
      isNaN(total) || isNaN(menang) ||
      total <= 0 || menang < 0 ||
      menang > total ||
      !Number.isInteger(total) || !Number.isInteger(menang)
    ) {
      alert("Jumlah set harus lebih dari 0 dan kemenangan tidak boleh negatif atau melebihi jumlah set.");
      return;
    }

    const kemenanganIndex = new Set();
    while (kemenanganIndex.size < menang) {
      kemenanganIndex.add(Math.floor(Math.random() * total));
    }

    const newSets = Array.from({ length: total }, (_, i) => {
      const id = setPermainan.length + i + 1;
      const status = kemenanganIndex.has(i) ? "MENANG" : "ZONK";

      if (status === "MENANG") {
        setHistoryPemenang(prev => [
          ...prev,
          {
            pemain: `pemain${id}@gmail.com`,
            status: "MENANG"
          }
        ]);
      }

      return { id, status };
    });

    setSetPermainan([...setPermainan, ...newSets]);
    setJumlahSet("");
    setJumlahMenang("");
  };

  const handleHapusSet = (id) => {
    const updated = setPermainan.filter(set => set.id !== id);
    setSetPermainan(updated);
  };

  const peluangMenang = () => {
    const total = setPermainan.length;
    const menang = setPermainan.filter(set => set.status === "MENANG").length;
    return total === 0
      ? "5% (default karena set habis)"
      : ((menang / total) * 100).toFixed(2) + "%";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold mb-6">Jackpot Admin</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="number"
          min="1"
          value={jumlahSet}
          onChange={(e) => setJumlahSet(e.target.value)}
          placeholder="Jumlah Set"
          className="p-2 rounded text-black"
        />
        <input
          type="number"
          min="0"
          value={jumlahMenang}
          onChange={(e) => setJumlahMenang(e.target.value)}
          placeholder="Jumlah Kemenangan"
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleTambahSet}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded"
        >
          Tambah Set
        </button>
      </div>

      <div className="mb-4 text-lg">
        <span className="text-yellow-300">Peluang Menang:</span> {peluangMenang()}
      </div>

      {setPermainan.length > 0 ? (
        <table className="w-full max-w-2xl text-center border border-yellow-600">
          <thead className="bg-yellow-700 text-black">
            <tr>
              <th className="p-2 border border-yellow-600">ID</th>
              <th className="p-2 border border-yellow-600">Status</th>
              <th className="p-2 border border-yellow-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {setPermainan.map((set) => (
              <tr key={set.id} className={set.status === "MENANG" ? "bg-green-800" : "bg-gray-800"}>
                <td className="p-2 border border-yellow-600">{set.id}</td>
                <td className="p-2 border border-yellow-600">
                  {set.status === "MENANG" ? "🎉 MENANG" : "❌ ZONK"}
                </td>
                <td className="p-2 border border-yellow-600">
                  <button
                    onClick={() => handleHapusSet(set.id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 mt-4">Belum ada set permainan.</p>
      )}

      {historyPemenang.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">History Kemenangan Pemain</h2>
          <table className="w-full max-w-2xl text-center border border-green-500">
            <thead className="bg-green-700 text-black">
              <tr>
                <th className="p-2 border border-green-500">Pemain</th>
                <th className="p-2 border border-green-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyPemenang.map((data, index) => (
                <tr key={index} className="bg-green-900">
                  <td className="p-2 border border-green-500">{data.pemain}</td>
                  <td className="p-2 border border-green-500"> {data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JackpotAdmin;
