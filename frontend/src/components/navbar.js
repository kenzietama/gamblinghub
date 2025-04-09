import React from "react";
import { Link } from "react-router-dom";
import logo from "../Picture/logogamblinghub.png";

const Navbar = () => {
  // Contoh data sementara, nanti bisa diganti dari state/auth
  const username = "pemain123";
  const saldo = 15000;

  return (
    <nav className="bg-[#1e1a18] shadow-md text-white">
      {/* Atas: Konten Utama Navbar */}
      <div className="p-4 px-6 flex justify-between items-center">
        {/* Kiri: Logo + Info User */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold text-gray-200">
              Username: <span className="text-indigo-400">{username}</span>
            </span>
            <span className="font-semibold text-gray-200">
              Saldo: <span className="text-green-400">Rp {saldo.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-6 text-base font-semibold">
          <Link to="/" className="hover:text-indigo-400 transition">Dashboard</Link>
          <Link to="/main-menu" className="hover:text-indigo-400 transition">Games</Link>
          <Link to="/top-up" className="hover:text-indigo-400 transition">Top Up</Link>
          <Link to="/profil" className="hover:text-indigo-400 transition">Profil</Link>
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Bawah: Marquee */}
      <div className="bg-[#2a2523] py-1">
      <marquee className="text-sm text-yellow-300 font-medium">
          {[
            "pemain123", "luckyOne", "jackpotJoker", "slotKing", "tebakHebat",
            "daduMaster", "suitSamurai", "blackAce", "queenBee", "dragonSlot",
            "kudaCepat", "coinHunter", "topSpin", "superTebak", "royalFlush",
            "ninjaPlayer", "winner88", "megawin99", "fastClicker", "chipBoss"
          ]
            .map(name => {
              const amount = Math.floor(Math.random() * 5 + 1) * 1000000;
              return `${name} melakukan withdraw sebesar Rp ${amount.toLocaleString()}`;
            })
            .join(" • ")
          }
        </marquee>
      </div>
    </nav>
  );
};

export default Navbar;
