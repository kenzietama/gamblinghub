// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import JackpotGame from "./pages/JackpotGame";
import TebakAngka from "./pages/TebakAngka";
import SuitJepang from "./pages/SuitJepang";
import Dadu from "./pages/Dadu";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/jackpot" element={<JackpotGame />} />
        <Route path="/tebak-angka" element={<TebakAngka />} />
        <Route path="/suit-jepang" element={<SuitJepang />} />
        <Route path="/dadu" element={<Dadu />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
