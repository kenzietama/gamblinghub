import React, {useEffect, useState} from "react";
import {useAdminStore} from "../../store/useAdminStore";
import {Loader2} from "lucide-react";
import toast from "react-hot-toast";

const JackpotAdmin = () => {
  const [jumlahSet, setJumlahSet] = useState("");
  const [jumlahMenang, setJumlahMenang] = useState("");
  const [setPermainan, setSetPermainan] = useState([]);
  const [historyPemenang, setHistoryPemenang] = useState([]);
  const [jackpotHistory, setJackpotHistory] = useState([]);
  const [toggleButton, setToggleButton] = useState(false);

  const {setWin, isUpdating, getJackpotHistory, isLoading, softDeleteJackpot, isDeleting, getJackpotRecycleBin, restoreJackpot, deleteJackpot} = useAdminStore();

  const handleTambahSet = () => {
    const total = parseInt(jumlahSet);
    const menang = parseInt(jumlahMenang);


    if (
      isNaN(total) || isNaN(menang) ||
      total <= 0 || menang < 0 ||
      menang > total ||
      !Number.isInteger(total) || !Number.isInteger(menang)
    ) {
      toast.error("Jumlah set harus lebih dari 0 dan kemenangan tidak boleh negatif atau melebihi jumlah set.");
      return;
    } else if (total > 20) {
      toast.error("Jumlah set tidak boleh lebih dari 20.");
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

  const handleHapusHistory = async (id) => {
    await softDeleteJackpot(id)
    const updated = jackpotHistory.filter(set => set.id !== id);
    setJackpotHistory(updated);
  }

  const handleRestoreJackpot = (id) => {
    restoreJackpot(id)
    const updated = jackpotHistory.filter(set => set.id !== id);
    setJackpotHistory(updated);
  }

  const handleDeleteJackpot = (id) => {
    deleteJackpot(id)
    const updated = jackpotHistory.filter(set => set.id !== id);
    setJackpotHistory(updated);
  }

  const handleSimpanSet = () => {
    const data = setPermainan.map(item => item.status === "MENANG" ? 1 : 0);
    setWin({data: data});
    setSetPermainan([]);
  }

  const peluangMenang = () => {
    const total = setPermainan.length;
    const menang = setPermainan.filter(set => set.status === "MENANG").length;
    return total === 0
      ? "10% (default karena set habis)"
      : ((menang / total) * 100).toFixed(2) + "%";
  };



  useEffect(() => {
    const fetchJackpotHistory = async () => {
      const history = await getJackpotHistory();
      setJackpotHistory(history);
    };

    const fetchRecycleBinJH = async () => {
      const trash = await getJackpotRecycleBin();
      setJackpotHistory(trash);
    }

    if(!toggleButton) {
        fetchJackpotHistory();
    } else {
        fetchRecycleBinJH();
    }

  }, [isUpdating, toggleButton]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Jackpot Admin</h1>

          <div className="flex flex-wrap gap-4 mb-4 justify-center">
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
            <button
                onClick={handleSimpanSet}
                disabled={setPermainan.length < 1}
                className="px-4 py-2 bg-green-500 disabled:bg-green-700 hover:bg-green-400 text-black font-semibold rounded"
            >
              {isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                    <span>Loading...</span>
                  </div>
              ) : (
                  "Simpan Set"
              )}
            </button>
          </div>

          <div className="mb-4 text-lg">
            {/*<span className="text-yellow-300">Peluang Menang:</span> {peluangMenang()}*/}
            <button
                type="button"
                onClick={() => setToggleButton(!toggleButton)}
                className={
                  !toggleButton
                      ? "px-4 py-2 text-black font-semibold rounded bg-yellow-500 hover:bg-yellow-400"
                      : "px-4 py-2 text-black font-semibold rounded bg-green-700 hover:bg-green-400"
                }
            >
              {!toggleButton ? "Restore" : "Kembali"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-1/2">
              <table className="w-full border border-yellow-600 text-center">
                <thead className="bg-yellow-400 text-black">
                <tr>
                  <th className="p-2 border border-yellow-600">ID</th>
                  <th className="p-2 border border-yellow-600">Setting</th>
                  <th className="p-2 border border-yellow-600">Hasil</th>
                  <th className="p-2 border border-yellow-600">Username</th>
                  <th className="p-2 border border-yellow-600">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin"/>
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                ) : jackpotHistory && jackpotHistory.length > 0 ? (
                    jackpotHistory.map((set) => (
                        <tr key={set.id} className={set.menang === 1 ? "bg-green-800" : "bg-gray-800"}>
                          <td className="p-2 border border-yellow-600">{set.id}</td>
                          <td className="p-2 border border-yellow-600">
                            {set.menang === null
                                ? "Tidak disetting"
                                : set.menang === 1
                                    ? "🎉 MENANG"
                                    : "❌ ZONK"
                            }
                          </td>
                          <td className="p-2 border border-yellow-600">
                            {set.result === 1 ? "🎉 MENANG" : "❌ ZONK"}
                          </td>
                          <td className="p-2 border border-yellow-600">
                            {set.username === null ? "Belum dimainkan" : set.username}
                          </td>
                          <td className="p-2 border border-yellow-600">
                                <>
                                  {!toggleButton ? (
                                        <button
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={() => handleHapusHistory(set.id)}
                                            className="px-3 py-1 rounded bg-red-600 hover:bg-red-500"
                                        >
                                          {!isDeleting ? "🗑️ Hapus" : "Loading..."}
                                        </button>
                                  ) : (
                                      <div className="flex gap-2 justify-center">
                                      <button
                                          type="button"
                                          disabled={isDeleting}
                                          onClick={() => handleRestoreJackpot(set.id)}
                                          className="px-3 py-1 rounded bg-green-500 disabled:bg-green-700 hover:bg-green-400"
                                      >
                                        Restore
                                      </button>
                                      <button
                                          type="button"
                                          disabled={isDeleting}
                                          onClick={() => handleDeleteJackpot(set.id)}
                                          className="px-3 py-1 rounded bg-red-600 disabled:bg-red-800 hover:bg-red-500"
                                      >
                                        Hapus Permanen
                                        </button>
                                      </div>
                                  )}
                                </>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        Tidak ada data history jackpot
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="w-full lg:w-1/2">
              {setPermainan && setPermainan.length > 0 ? (
                  <table className="w-full border border-yellow-600 text-center">
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
                  <p className="text-gray-400 mt-4 text-center">Belum ada set permainan.</p>
              )}
            </div>
          </div>


          {/*{historyPemenang.length > 0 && (*/}
          {/*    <div className="mt-10">*/}
          {/*      <h2 className="text-2xl font-semibold mb-4 text-center">History Kemenangan Pemain</h2>*/}
          {/*      <table className="w-full border border-green-500 text-center">*/}
          {/*        <thead className="bg-green-700 text-black">*/}
          {/*        <tr>*/}
          {/*          <th className="p-2 border border-green-500">Pemain</th>*/}
          {/*          <th className="p-2 border border-green-500">Status</th>*/}
          {/*        </tr>*/}
          {/*        </thead>*/}
          {/*        <tbody>*/}
          {/*        {historyPemenang.map((data, index) => (*/}
          {/*            <tr key={index} className="bg-green-900">*/}
          {/*              <td className="p-2 border border-green-500">{data.pemain}</td>*/}
          {/*              <td className="p-2 border border-green-500"> {data.status}</td>*/}
          {/*            </tr>*/}
          {/*        ))}*/}
          {/*        </tbody>*/}
          {/*      </table>*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>
      </div>
  );
};

export default JackpotAdmin;
