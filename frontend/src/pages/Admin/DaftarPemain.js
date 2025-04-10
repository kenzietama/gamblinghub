import React, { useState } from "react";
import { Link } from "react-router-dom";

const dummyPemain = [
  { email: "andi@mail.com", username: "andigame", saldo: 250000 },
  { email: "sita@mail.com", username: "sita88", saldo: 800000 },
  { email: "budi@mail.com", username: "budiKing", saldo: 150000 },
  { email: "maya@mail.com", username: "mayaQueen", saldo: 920000 },
  { email: "udin@mail.com", username: "udinslot", saldo: 310000 },
];

const DaftarPemain = () => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("username");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredPlayers = dummyPemain
    .filter(
      (p) =>
        p.username.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "saldo") {
        return sortAsc ? a.saldo - b.saldo : b.saldo - a.saldo;
      } else {
        return sortAsc
          ? a[sortKey].localeCompare(b[sortKey])
          : b[sortKey].localeCompare(a[sortKey]);
      }
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Pemain</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Cari pemain berdasarkan email atau username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 border border-indigo-500 text-white placeholder-indigo-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-left table-auto bg-gray-800 border border-gray-700">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th
                className="p-3 cursor-pointer w-1/3"
                onClick={() => handleSort("email")}
              >
                📧 Email {sortKey === "email" && (sortAsc ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer w-1/4"
                onClick={() => handleSort("username")}
              >
                👤 Username {sortKey === "username" && (sortAsc ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer w-1/4"
                onClick={() => handleSort("saldo")}
              >
                💰 Saldo {sortKey === "saldo" && (sortAsc ? "▲" : "▼")}
              </th>
              <th className="p-3 w-1/6 text-center">🧾 Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((pemain, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-gray-700 even:bg-gray-800 hover:bg-indigo-900"
                >
                  <td className="p-3 align-middle">{pemain.email}</td>
                  <td className="p-3 align-middle">{pemain.username}</td>
                  <td className="p-3 align-middle">{pemain.saldo.toLocaleString()} koin</td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/admin/pemain/${pemain.username}`}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-indigo-300 italic"
                >
                  Tidak ada pemain yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaftarPemain;
