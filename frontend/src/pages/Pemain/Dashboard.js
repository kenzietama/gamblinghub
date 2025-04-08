import React from "react";
import { Link } from "react-router-dom";

// Fungsi pembangkit angka pseudo-random berbasis string
const seededRandomNumber = (seedStr) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const result = Math.abs(hash % 9000) + 1000; // hasil 4 digit
  return result;
};

// Fungsi format tanggal ke dd-mm-yyyy
const formatDate = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

const todayDate = new Date();
const todayFormatted = formatDate(todayDate);
const todaySeedFormat = todayDate.toISOString().split("T")[0]; // format YYYY-MM-DD untuk seed

// Data negara
const negaraList = [
  { nama: "Hongkong" },
  { nama: "Singapura" },
  { nama: "Kamboja" },
  { nama: "Taiwan" },
  { nama: "Las Vegas" },
  { nama: "Jakarta" },
  { nama: "Sydney" },
  { nama: "Kuala Lumpur" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">

      {/* Section 1: Header dan Penjelasan */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎮 Selamat datang, Player!</h1>
        <p className="text-indigo-300 text-lg mb-8">Ayo mulai bermain dan raih skor tertinggi!</p>

        <div className="bg-indigo-950 bg-opacity-60 p-6 rounded-xl inline-block text-left border border-indigo-500 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-indigo-300 mb-2 text-center">💸 Gambling Hub</h2>
          <p className="text-sm text-indigo-200 text-center">
            Website ini menyediakan berbagai jenis permainan taruhan dari seluruh dunia.  
            Mainkan dan menangkan keberuntunganmu sekarang!
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-bold mb-4">Keluaran Angka Togel</h1>

        {/* Header Tabel */}
        <div className="grid grid-cols-3 font-semibold text-indigo-200 border-b border-indigo-600 pb-2 mb-2">
          <div className="text-left">Negara</div>
          <div className="text-center">Angka</div>
          <div className="text-right">Tanggal</div>
        </div>

        {/* Baris Data */}
        {negaraList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center text-indigo-300 py-2 border-b border-indigo-800"
          >
            <div className="text-left">{item.nama}</div>
            <div className="text-center text-indigo-400 font-bold text-lg">
              {seededRandomNumber(item.nama + todaySeedFormat)}
            </div>
            <div className="text-right text-gray-400 text-sm">{todayFormatted}</div>
          </div>
        ))}
      </section>

    </div>
  );
};

export default Dashboard;
