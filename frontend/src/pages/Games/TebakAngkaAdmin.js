import React, {useEffect, useState} from "react";
import {useGameStore} from "../../store/useGameStore";
import {useAdminStore} from "../../store/useAdminStore";
import {useAuthStore} from "../../store/useAuthStore";
import {useDataStore} from "../../store/useDataStore";

const formatUang = (value) => {
  if (!value) return "";
  return parseInt(value).toLocaleString("id-ID");
};

const TebakAngkaAdmin = () => {
  const [angkaRahasia, setAngkaRahasia] = useState();
  const [isRevealed, setIsRevealed] = useState(false);
  const [historyPemenang, setHistoryPemenang] = useState([]);

  const {getCurrentLottery, isLoadingLottery} = useGameStore()
  const {setAngkaAsli, isSettingAngkaAsli, getTogelHistory, isLoading} = useAdminStore()
  const {authUser, } = useAuthStore();
  const {getUserBalance} = useDataStore()


  const [pemainList, setPemainList] = useState([
    // {
    //   email: "udin@example.com",
    //   username: "Udin123",
    //   tebakan: "1234",
    //   taruhan: 20000,
    // },
    // {
    //   email: "sari@example.com",
    //   username: "SariKeren",
    //   tebakan: "5678",
    //   taruhan: 30000,
    // },
    // {
    //   email: "agus@example.com",
    //   username: "Agus99",
    //   tebakan: "4321",
    //   taruhan: 15000,
    // },
  ]);

  const handleReveal = async () => {
    if (angkaRahasia.length !== 4 || isNaN(angkaRahasia)) return;

    await setAngkaAsli(angkaRahasia)

    // const pemenangBaru = pemainList
    //   .filter((p) => p.tebakan === angkaRahasia)
    //   .map((p) => ({
    //     ...p,
    //     angkaRahasia,
    //     reward: p.taruhan * 2,
    //   }));

    // setHistoryPemenang((prev) => [...prev, ...pemenangBaru]);
    // setIsRevealed(true);
  };

  useEffect(() => {
    const fetchLotteryData = async () => {
      const data = await getCurrentLottery();
      if (data) {
        setPemainList(data);
      }
    };

    const fetchHistory = async () => {
        const data = await getTogelHistory();
        if (data) {
            setHistoryPemenang(data);
        }
    }

    const fetchSaldo = async () => {
      try {
        if (authUser) {
          const res = await getUserBalance();
        } else {

        }
      } catch (error) {
        console.error("Error fetching saldo:", error);
      }
    };

    fetchSaldo();

    fetchLotteryData();
    fetchHistory()
  }, [getCurrentLottery]);

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
          <h2 className="text-xl font-semibold mb-4">Daftar Pemain Sekarang</h2>
          {isLoadingLottery ? (
              <div className="py-8 text-center text-gray-400">
                <div
                    className="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
                <p>Loading data...</p>
              </div>
          ) : (
              pemainList && pemainList.length > 0 ? (
                  <table className="w-full text-left table-auto border-collapse">
                    <thead>
                    <tr className="text-indigo-400 border-b border-indigo-700">
                      <th className="py-2">Email</th>
                      <th>Username</th>
                      <th>Angka Tebakan</th>
                      <th>Taruhan</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pemainList.map((pemain, i) => (
                        <tr key={i} className="border-t border-gray-700">
                          <td className="py-2">{pemain.email}</td>
                          <td>{pemain.username}</td>
                          <td className="text-center">{pemain.tebakan}</td>
                          <td className="text-right">{formatUang(pemain.taruhan)} koin</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              ) : (
                  <div className="py-8 text-center text-gray-400">
                    Tidak ada data pemain saat ini
                  </div>
              )
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Riwayat Tebakangka</h2>
        {isLoading ? (
            <div className="py-8 text-center text-gray-400">
              <div
                  className="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
              <p>Loading data...</p>
            </div>
        ) : (
            historyPemenang && historyPemenang.length > 0 ? (
                <table className="w-full text-center table-auto border-collapse">
                  <thead>
                  <tr className="text-indigo-400 border-b border-indigo-700">
                    <th className="py-2">Email</th>
                    <th>Username</th>
                    <th>Angka Tebakan</th>
                    <th>Angka Asli</th>
                    <th>Taruhan</th>
                    <th>Keterangan</th>
                    <th>Saldo</th>
                  </tr>
                  </thead>
                  <tbody>
                  {historyPemenang.map((pemain, i) => (
                      <tr key={i} className="border-t border-gray-700">
                        <td className="py-2">{pemain.email}</td>
                        <td>{pemain.username}</td>
                        <td className="text-center">{pemain.tebakan}</td>
                        <td className="text-center">{pemain.angka_asli}</td>
                        <td className="text-center">{formatUang(pemain.taruhan)} koin</td>
                        <td className="text-center">{pemain.tebakan === pemain.angka_asli ? "MENANG" : "KALAH"} </td>
                        <td className="text-center">{pemain.tebakan === pemain.angka_asli ? `+${formatUang(pemain.taruhan * 9)}` : `-${formatUang(pemain.taruhan)}`} koin </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            ) : (
                <div className="py-8 text-center text-gray-400">
                  Tidak ada data pemain saat ini
                </div>
            )
        )}

      </div>
  );
};

export default TebakAngkaAdmin;
