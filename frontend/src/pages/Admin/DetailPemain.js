import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Fungsi bantu
const formatUang = (value) => {
  if (!value) return "";
  return parseInt(value).toLocaleString("id-ID");
};

const parseUang = (formatted) => {
  return parseInt(formatted.replace(/\./g, "")) || 0;
};

const DetailPemain = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tambahSaldo, setTambahSaldo] = useState("");
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const dummyUser = {
      id: userId,
      email: "example@gmail.com",
      username: "pemain123",
      saldo: 250000,
    };
    setUser(dummyUser);
  }, [userId]);

  const handleInputSaldo = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setTambahSaldo(formatUang(raw));
  };

  const handleTambahSaldo = () => {
    const nominal = parseUang(tambahSaldo);
    if (!nominal || nominal <= 0) {
      setPesan("❌ Masukkan nominal saldo yang valid.");
      return;
    }

    setUser((prev) => ({
      ...prev,
      saldo: prev.saldo + nominal,
    }));

    setTambahSaldo("");
    setPesan(`✅ Saldo berhasil ditambahkan +${formatUang(nominal)} koin`);
  };

  if (!user) return <div className="text-white p-6">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-[#1e1a18] rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-center mb-10">Detail Pemain</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
          <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
            <p className="text-sm uppercase tracking-widest text-gray-400">Email</p>
            <p className="text-lg font-semibold text-white">{user.email}</p>
          </div>

          <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
            <p className="text-sm uppercase tracking-widest text-gray-400">Username</p>
            <p className="text-lg font-semibold text-white">{user.username}</p>
          </div>

          <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
            <p className="text-sm uppercase tracking-widest text-gray-400">Saldo</p>
            <p className="text-xl font-bold text-green-400">Rp {formatUang(user.saldo)}</p>
          </div>

          <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
            <p className="text-sm uppercase tracking-widest text-gray-400">Tambah Saldo</p>
            <input
              type="text"
              value={tambahSaldo}
              onChange={handleInputSaldo}
              className="w-full p-2 mt-1 rounded text-black"
              placeholder="Masukkan nominal"
            />
          </div>
        </div>

        {pesan && <p className="mt-4 text-sm text-green-300">{pesan}</p>}

        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
          <button
            onClick={handleTambahSaldo}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition"
          >
            ➕ Tambah Saldo
          </button>

          <button
            onClick={() => navigate("/daftarpemain")}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-white font-semibold transition"
          >
            Kembali ke Daftar Pemain
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPemain;
