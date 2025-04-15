import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import {useDataStore} from "../../store/useDataStore";

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
  const [angkaRahasia, setAngkaRahasia] = useState(generateRandom4Digit());
  const [isRevealed, setIsRevealed] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [pesan, setPesan] = useState("");
  const [peringatan, setPeringatan] = useState("");
  const [tebakanList, setTebakanList] = useState([
    { angka: "", taruhan: "", disabled: false }
  ]);
  const [isLoadings, setIsLoadings] = useState(true);
  // Store all existing lottery numbers from database
  const [existingNumbers, setExistingNumbers] = useState([]);

  const { getUserLottery, setLottery, isUpdatingLottery } = useGameStore();
  const {setBet, updateBalance, isUpdatingBalance} = useGameStore()
  const { getUserBalance, isLoading } = useDataStore();

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
  }, [isUpdatingBalance, isUpdatingLottery]);

  // Fetch existing user lottery entries on page load
  useEffect(() => {
    const fetchUserLottery = async () => {
      setIsLoadings(true);
      try {
        const data = await getUserLottery();

        // Store all existing numbers for duplicate checking
        if (data && data.length > 0) {
          setExistingNumbers(data.map(entry => entry.tebakan));

          // Transform the API data format to component state format
          const existingEntries = data.map(entry => ({
            angka: entry.tebakan.toString(),
            taruhan: entry.taruhan.toString(),
            disabled: true // Existing entries are locked
          }));

          // If there are fewer than 5 entries, add an empty one for new input
          if (existingEntries.length < 5) {
            existingEntries.push({ angka: "", taruhan: "", disabled: false });
          }

          setTebakanList(existingEntries);
        }
      } catch (error) {
        console.error("Error fetching lottery data:", error);
      } finally {
        setIsLoadings(false);
      }
    };

    fetchUserLottery();
  }, [getUserLottery]);

  const totalTaruhanSaatIni = () => {
    return tebakanList.reduce((acc, t) => acc + parseUang(t.taruhan || "0"), 0);
  };

  const isNumberDuplicate = (number, currentIndex) => {
    if (!number || number.length !== 4) return false;

    // Check if number exists in database
    if (existingNumbers.includes(number)) {
      return true;
    }

    // Check if number exists in current form entries
    return tebakanList.some((tebakan, index) =>
        index !== currentIndex && tebakan.angka === number
    );
  };

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

    const totalBaru = newList.reduce((acc, t) => acc + parseUang(t.taruhan || "0"), 0);
    if (totalBaru > saldo) {
      setPeringatan("⚠️ Total taruhan melebihi saldo.");
    } else if (!peringatan.includes("Angka ini sudah digunakan")) {
      setPeringatan("");
    }
  };

  const tambahSetTebakan = () => {
    const last = tebakanList[tebakanList.length - 1];
    const currentTotal = totalTaruhanSaatIni();

    if (tebakanList.length >= 5) return;
    if (!last.angka || !last.taruhan) return;
    if (last.angka.length !== 4) {
      setPeringatan("⚠️ Angka tebakan harus 4 digit.");
      return;
    }

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

  const handleTebak = async () => {
    // Get only the new entries (not disabled) for sending to backend
    const newGuesses = tebakanList
        .filter(({ angka, taruhan, disabled }) =>
            !disabled && angka.length === 4 && parseUang(taruhan || "0") > 0)
        .map(({ angka, taruhan }) => ({
          tebakan: angka,
          taruhan: parseUang(taruhan || "0")  // Convert to integer
        }));

    // If there are new guesses, send them to the backend
    if (newGuesses.length > 0) {
      try {
        // console.log("Submitting new guesses:", newGuesses);

        // After successful submission, add the new numbers to existingNumbers for duplicate checking
        const newNumbers = newGuesses.map(guess => guess.tebakan);
        setExistingNumbers(prev => [...prev, ...newNumbers]);

        // After successful submission, disable the submitted guesses
        const updatedList = tebakanList.map(item => {
          if (!item.disabled && item.angka.length === 4 && parseUang(item.taruhan || "0") > 0) {
            return { ...item, disabled: true };
          }
          return item;
        });

        // If there's room for more guesses, add a new empty entry
        if (updatedList.length < 5) {
          updatedList.push({ angka: "", taruhan: "", disabled: false });
        }

        setTebakanList(updatedList);
        await setLottery(tebakanList);
      } catch (error) {
        console.error("Error submitting lottery guesses:", error);
      }
    }

    // Handle game logic as before
    // let totalBet = 0;
    // let reward = 0;
    // let message = "";
    //
    // tebakanList.forEach(({ angka, taruhan }, i) => {
    //   const bet = parseUang(taruhan || "0");
    //
    //   if (angka.length === 4 && bet > 0) {
    //     totalBet += bet;
    //     if (angka === angkaRahasia) {
    //       reward += bet * 2;
    //       message += `✅ Set ${i + 1} BENAR! +${formatUang(bet * 2)} koin\n`;
    //     } else {
    //       message += `❌ Set ${i + 1} salah. -${formatUang(bet)} koin\n`;
    //     }
    //   }
    // });

    // if (totalBet > saldo) {
    //   setPesan("❗ Total taruhan melebihi saldo!");
    //   return;
    // }

    // setSaldo((s) => s - totalBet + reward);
    // setIsRevealed(true);
    // setPesan(message || "⚠️ Tidak ada tebakan valid.");

    setTimeout(() => {
      setAngkaRahasia(generateRandom4Digit());
      setIsRevealed(false);
      setPeringatan("");
    }, 3000);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white">
          <div className="text-xl">Loading...</div>
        </div>
    );
  }

  return (
      <div
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white p-6">
        <h1 className="text-4xl font-bold text-indigo-300 mb-4">🎯 Tebak Angka Rahasia</h1>

        <div className="mb-4 text-lg text-center">
          Saldo: 💰
          {isUpdatingBalance || isLoading
              ? "Loading..."
              : saldo ? ` ${formatUang(saldo)} koin` : "Loading..."
          }
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
              : Array.from({length: 4}).map((_, i) => (
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
              </div>
          ))}
        </div>

        {tebakanList.length < 5 && tebakanList.some(item => !item.disabled) && (
            <button
                onClick={tambahSetTebakan}
                className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
            >
              ➕ Tambah Set Tebakan
            </button>
        )}

        <button
            onClick={handleTebak}
            disabled={isUpdatingLottery || saldo <= 0 || !tebakanList.some(item => !item.disabled)}
            className={`w-full max-w-md py-3 rounded-xl font-bold text-white text-xl ${
                isUpdatingLottery || saldo <= 0 || !tebakanList.some(item => !item.disabled)
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
            }`}
        >
          {isUpdatingLottery ? 'Menyimpan...' : '🚀 Kirim Tebakan'}
        </button>

        {pesan && (
            <pre
                className="mt-4 bg-indigo-800 bg-opacity-40 p-4 rounded-lg whitespace-pre-wrap text-sm text-indigo-200">
          {pesan}
        </pre>
        )}
      </div>
  );
};

export default TebakAngka;