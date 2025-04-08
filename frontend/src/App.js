// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// General
import Login from "./pages/Login";
import Register from "./pages/Register";

// Sisi Pemain
import Dashboard from "./pages/Pemain/Dashboard";
import MainMenu from "./pages/Pemain/MainMenu";
import TopUp from "./pages/Pemain/TopUp";
import Profil from "./pages/Pemain/Profil";

// Games
import JackpotGame from "./pages/Games/JackpotGame";
import TebakAngka from "./pages/Games/TebakAngka";
import SuitJepang from "./pages/Games/SuitJepang";
import Dadu from "./pages/Games/Dadu";

function App() {
  return (
    <Router>
      <Routes>
        {/* General */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pemain */}
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/top-up" element={<TopUp />} />
        <Route path="/profil" element={<Profil />} />

        {/* Games */}
        <Route path="/jackpot" element={<JackpotGame />} />
        <Route path="/tebak-angka" element={<TebakAngka />} />
        <Route path="/suit-jepang" element={<SuitJepang />} />
        <Route path="/dadu" element={<Dadu />} />
      </Routes>
    </Router>
  );
}

export default App;
