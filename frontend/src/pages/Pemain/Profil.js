import React from "react";
import { useNavigate } from "react-router-dom";
import {useAuthStore} from "../../store/useAuthStore";

const Profil = () => {
  const navigate = useNavigate();
  const {deleteAccount, logout, authUser} = useAuthStore()

  const handleTobat = async () => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus akun Anda? Ini tidak bisa dibatalkan!");
    if (konfirmasi) {
      await deleteAccount({navigate});
    }
  };

  const handleEditProfile = () => {
    navigate("/profiledit");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
        <div className="max-w-3xl mx-auto bg-[#1e1a18] rounded-2xl shadow-lg p-10">
          <h1 className="text-4xl font-bold text-center mb-10">Profil Pengguna</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
            <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
              <p className="text-sm uppercase tracking-widest text-gray-400">Email</p>
              <p className="text-lg font-semibold text-white">{authUser.email}</p>
            </div>

            <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
              <p className="text-sm uppercase tracking-widest text-gray-400">Username</p>
              <p className="text-lg font-semibold text-white">{authUser.username}</p>
            </div>

            <div className="bg-[#2a2523] p-5 rounded-xl shadow-inner border border-yellow-900">
              <p className="text-sm uppercase tracking-widest text-gray-400">Saldo</p>
              <p className="text-xl font-bold text-green-400">Rp {authUser.saldo?.toLocaleString() || "0"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">

            <button
              onClick={handleEditProfile}
              className="bg-indigo-700 hover:bg-indigo-600 px-6 py-3 rounded-xl text-white font-semibold transition"
            >
              Edit Profil
            </button>

            {/* <button
              onClick={handleTobat}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-red-300 font-semibold transition"
            >
              Tobat (Hapus Akun)
            </button> */}
          </div>
        </div>
      </div>
  );
};

export default Profil;
