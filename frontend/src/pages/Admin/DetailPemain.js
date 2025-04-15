import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useDataStore} from "../../store/useDataStore";
import {Loader, Loader2} from "lucide-react";
import toast from "react-hot-toast";
import {useAdminStore} from "../../store/useAdminStore";

// Fungsi bantu
const formatUang = (value) => {
  if (!value) return "0";
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
  const [isLoading, setIsLoading] = useState(true);
  const { getUser } = useDataStore();
  const { addBalance, isUpdating } = useAdminStore()

  useEffect( () => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        toast.error("Gagal memuat data pengguna");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [userId, getUser]);

  const handleInputSaldo = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setTambahSaldo(formatUang(raw));
  };

  const handleTambahSaldo = async () => {
    const nominal = parseUang(tambahSaldo);
    if (!nominal || nominal <= 0) {
      toast.error("Masukkan nominal saldo yang valid.");
      return;
    }

    try {
      await addBalance(userId, nominal);

      setUser((prev) => ({
        ...prev,
        saldo: Number(prev.saldo || 0) + nominal,
      }));

      setTambahSaldo("");
    } catch (error) {

    }
  };

  if(isLoading) return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">
        <Loader className="size-10 animate-spin"/>
      </div>
  )

  if(!user) return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">Data pemain tidak ditemukan</div>
  )

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

        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
          <button
            onClick={handleTambahSaldo}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition"
          >
            {isUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
            ) : (
                "➕ Tambah Saldo"
            )}
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
