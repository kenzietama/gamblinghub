import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useDataStore } from "../../store/useDataStore";
import toast from "react-hot-toast";
import {useAdminStore} from "../../store/useAdminStore";

const generateRandom4Digit = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
};

const formatUang = (value) => {
  if (!value) return "";
  return parseInt(value).toLocaleString("id-ID");
};

const parseUang = (formatted) => {
  if (typeof formatted === 'number') return formatted;
  return parseInt((formatted || "").replace(/\./g, "")) || 0;
};

const TebakAngka = () => {
  const [tebakanList, setTebakanList] = useState([{ angka: "", taruhan: "", disabled: false }]);
  const [saldo, setSaldo] = useState(0);
  const [peringatan, setPeringatan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [existingNumbers, setExistingNumbers] = useState([]);

  const [historyPemenang, setHistoryPemenang] = useState([]);


  const { getUserLottery, setLottery, isUpdatingLottery } = useGameStore();
  const { getUserBalance, getUserTogelHistory } = useDataStore();

  // Fetch user balance
  const fetchSaldo = async () => {
    try {
      const res = await getUserBalance();
      setSaldo(res.saldo);
    } catch (error) {
      console.error("Error fetching saldo:", error);
      toast.error("Gagal memuat saldo");
    }
  };

  const fetchHistory = async () => {
    const data = await getUserTogelHistory();
    if (data) {
      setHistoryPemenang(data);
    }
  }

  // Load user data when component mounts or balance updates
  useEffect(() => {
    fetchSaldo();
    fetchHistory()
    fetchUserLottery()
  }, [isUpdatingLottery]);

  // Fetch existing lottery entries
  const fetchUserLottery = async () => {
    setIsLoading(true);
    try {
      const data = await getUserLottery();

      if (data && data.length > 0) {
        setExistingNumbers(data.map(entry => entry.tebakan));

        const existingEntries = data.map(entry => ({
          angka: entry.tebakan.toString(),
          taruhan: entry.taruhan.toString(),
          disabled: true
        }));

        if (existingEntries.length < 5) {
          existingEntries.push({ angka: "", taruhan: "", disabled: false });
        }

        setTebakanList(existingEntries);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total bet amount
  const totalTaruhanSaatIni = () => {
    return tebakanList.reduce((acc, t) => acc + parseUang(t.taruhan || "0"), 0);
  };

  // Check if a number is already used
  const isNumberDuplicate = (number, currentIndex) => {
    if (!number || number.length !== 4) return false;

    if (existingNumbers.includes(number)) {
      return true;
    }

    return tebakanList.some((tebakan, index) =>
        index !== currentIndex && tebakan.angka === number
    );
  };

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const newList = [...tebakanList];
    if (newList[index].disabled) return;

    if (field === "angka") {
      const newValue = value.replace(/\D/g, "").slice(0, 4);

      if (newValue.length === 4 && isNumberDuplicate(newValue, index)) {
        setPeringatan("⚠️ Angka ini sudah digunakan. Pilih angka lain.");
        return;
      }

      newList[index][field] = newValue;
      if (peringatan.includes("Angka ini sudah digunakan")) {
        setPeringatan("");
      }
    } else {
      newList[index][field] = value.replace(/\D/g, "");
    }

    setTebakanList(newList);

    const totalBaru = totalTaruhanSaatIni();
    if (totalBaru > saldo) {
      setPeringatan("⚠️ Total taruhan melebihi saldo.");
    } else if (!peringatan.includes("Angka ini sudah digunakan")) {
      setPeringatan("");
    }
  };

  // Add new betting set
  const tambahSetTebakan = () => {
    const last = tebakanList[tebakanList.length - 1];

    if (tebakanList.length >= 5) return;
    if (!last.angka || !last.taruhan) return;
    if (last.angka.length !== 4) {
      setPeringatan("⚠️ Angka tebakan harus 4 digit.");
      return;
    }

    if (totalTaruhanSaatIni() > saldo) {
      setPeringatan("⚠️ Total taruhan melebihi saldo.");
      return;
    }

    const updatedList = [...tebakanList];
    updatedList[updatedList.length - 1].disabled = true;
    updatedList.push({ angka: "", taruhan: "", disabled: false });

    setTebakanList(updatedList);
    setPeringatan("");
  };

  const handleSaveSingleBet = async (index) => {
    const bet = tebakanList[index];

    // Validate input
    if (bet.angka.length !== 4 || parseUang(bet.taruhan || "0") <= 0) {
      toast.error("Angka harus 4 digit dan taruhan harus lebih dari 0");
      return;
    }

    if (isNumberDuplicate(bet.angka, index)) {
      setPeringatan("⚠️ Angka ini sudah digunakan. Pilih angka lain.");
      return;
    }

    const betAmount = parseUang(bet.taruhan || "0");
    if (betAmount > saldo) {
      setPeringatan("⚠️ Taruhan melebihi saldo.");
      return;
    }

    try {
      // Send single bet to backend
      const singleBet = [{
        tebakan: bet.angka,
        taruhan: betAmount
      }];

      const result = await setLottery(singleBet);

      if (result && result.newBalance !== undefined) {
        setSaldo(result.newBalance);
        toast.success(`Tebakan ${bet.angka} berhasil disimpan!`);

        // Update local state
        setExistingNumbers(prev => [...prev, bet.angka]);

        // Update UI list - disable this bet
        const updatedList = [...tebakanList];
        updatedList[index] = { ...bet, disabled: true };

        // Add new empty bet field if under limit
        if (updatedList.filter(item => !item.disabled).length === 0 && updatedList.length < 5) {
          updatedList.push({ angka: "", taruhan: "", disabled: false });
        }

        setTebakanList(updatedList);
      }
    } catch (error) {
      console.error("Error saving bet:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan tebakan");
    }
  };

  // Submit bets to the server
  const handleTebak = async () => {
    // Validate inputs
    const newGuesses = tebakanList
        .filter(({ angka, taruhan, disabled }) =>
            !disabled && angka.length === 4 && parseUang(taruhan || "0") > 0)
        .map(({ angka, taruhan }) => ({
          tebakan: angka,
          taruhan: parseUang(taruhan || "0")
        }));

    if (newGuesses.length === 0) {
      toast.error("Tidak ada tebakan yang valid");
      return;
    }

    const totalBet = newGuesses.reduce((sum, item) => sum + item.taruhan, 0);
    // if (totalBet > saldo) {
    //   setPeringatan("⚠️ Total taruhan melebihi saldo.");
    //   toast.error("Saldo tidak cukup");
    //   return;
    // }

    try {
      // Send to backend
      const result = await setLottery(newGuesses);

      if (result && result.newBalance !== undefined) {
        setSaldo(result.newBalance);
        toast.success(`Tebakan berhasil disimpan! Saldo: ${formatUang(result.newBalance)}`);
      }

      // Update local state
      const newNumbers = newGuesses.map(guess => guess.tebakan);
      setExistingNumbers(prev => [...prev, ...newNumbers]);

      // Update UI list
      const updatedList = tebakanList.map(item => {
        if (!item.disabled && item.angka.length === 4 && parseUang(item.taruhan || "0") > 0) {
          return { ...item, disabled: true };
        }
        return item;
      });

      if (updatedList.length < 5) {
        updatedList.push({ angka: "", taruhan: "", disabled: false });
      }

      setTebakanList(updatedList);
    } catch (error) {
      console.error("Error submitting lottery guesses:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan tebakan");
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white">
          <div className="text-xl">Loading...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
        <h1 className="text-4xl font-bold text-indigo-300 mb-4">🎯 Tebak Angka Rahasia</h1>

        <div className="mb-4 text-lg text-center">
          Saldo: 💰 {isUpdatingLottery ? "Loading..." : formatUang(saldo)} koin
        </div>

        {peringatan && (
            <div className="text-yellow-300 mb-4 text-sm bg-yellow-900 bg-opacity-30 p-2 rounded">
              {peringatan}
            </div>
        )}

        <div className="w-full max-w-md flex flex-col gap-4 mb-4">
          {tebakanList.map((tebakan, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                    type="text"
                    value={tebakan.angka}
                    onChange={(e) => handleInputChange(index, "angka", e.target.value)}
                    disabled={tebakan.disabled}
                    className={`w-32 p-2 text-center text-black text-lg rounded ${
                        tebakan.disabled ? "bg-gray-200" : ""
                    }`}
                    placeholder="4 digit"
                />
                <input
                    type="text"
                    value={formatUang(tebakan.taruhan)}
                    onChange={(e) =>
                        handleInputChange(index, "taruhan", e.target.value.replace(/\D/g, ""))
                    }
                    disabled={tebakan.disabled}
                    className={`flex-1 p-2 text-center text-black text-lg rounded ${
                        tebakan.disabled ? "bg-gray-200" : ""
                    }`}
                    placeholder="Taruhan"
                />
                {!tebakan.disabled && (
                    <button
                        onClick={() => handleSaveSingleBet(index)}
                        disabled={isUpdatingLottery || tebakan.angka.length !== 4 || !parseUang(tebakan.taruhan)}
                        className={`px-3 py-2 rounded text-white ${
                            isUpdatingLottery || tebakan.angka.length !== 4 || !parseUang(tebakan.taruhan)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-500"
                        }`}
                        title="Simpan tebakan ini"
                    >
                      💾
                    </button>
                )}
              </div>
          ))}
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
                        <td className="text-center">{pemain.tebakan}</td>
                        <td className="text-center">{pemain.angka_asli}</td>
                        <td className="text-center">{formatUang(pemain.taruhan)} koin</td>
                        <td className="text-center">{pemain.tebakan === pemain.angka_asli ? "MENANG" : "KALAH"}</td>
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

        {/*{tebakanList.length < 5 && tebakanList.some(item => !item.disabled) && (*/}
        {/*    <button*/}
        {/*        onClick={tambahSetTebakan}*/}
        {/*        className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"*/}
        {/*    >*/}
        {/*      ➕ Tambah Set Tebakan*/}
        {/*    </button>*/}
        {/*)}*/}

        {/*<button*/}
        {/*    onClick={handleTebak}*/}
        {/*    disabled={isUpdatingLottery || saldo <= 0 || !tebakanList.some(item => !item.disabled)}*/}
        {/*    className={`w-full max-w-md py-3 rounded-xl font-bold text-white text-xl ${*/}
        {/*        isUpdatingLottery || saldo <= 0 || !tebakanList.some(item => !item.disabled)*/}
        {/*            ? "bg-gray-600 cursor-not-allowed"*/}
        {/*            : "bg-indigo-600 hover:bg-indigo-500"*/}
        {/*    }`}*/}
        {/*>*/}
        {/*  {isUpdatingLottery ? 'Menyimpan...' : '🚀 Kirim Tebakan'}*/}
        {/*</button>*/}
      </div>
  );
};

export default TebakAngka;