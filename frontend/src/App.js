// App.js
import React, {useEffect, useState} from "react";
import {Routes, Route, useLocation, Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {useAuthStore} from "./store/useAuthStore";
import {Loader} from 'lucide-react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// General
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Sisi Pemain
import MainMenu from "./pages/Pemain/MainMenu";
import TopUp from "./pages/Pemain/TopUp";
import Profil from "./pages/Pemain/Profil";
import ProfilEdit from "./pages/Pemain/ProfilEdit";

// Sisi Admin
import MainMenuAdmin from "./pages/Admin/MainMenuAdmin";
import DaftarPemain from "./pages/Admin/DaftarPemain";
import DetailPemain from "./pages/Admin/DetailPemain";

// Games Sisi Admin
import JackpotGameAdmin from "./pages/Games/JackpotGameAdmin";
import TebakAngkaAdmin from "./pages/Games/TebakAngkaAdmin";

// Games Sisi Pemain
import JackpotGame from "./pages/Games/JackpotGame";
import TebakAngka from "./pages/Games/TebakAngka";
import Blackjack from "./pages/Games/Blackjack";
import Dadu from "./pages/Games/Dadu";

import {setLogoutFunction, setRefreshingTokenFunction} from "./lib/axios";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import EditPassword from "./pages/Pemain/EditPassword";

function App() {
    const {authUser, checkAuth, isCheckingAuth, logout, setRefreshingToken} = useAuthStore();
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLogoutFunction(logout);
        setRefreshingTokenFunction(setRefreshingToken);
    }, [logout, setRefreshingToken]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            // Increase timeout to avoid race conditions with token refresh
            await new Promise(resolve => setTimeout(resolve, 10));
            await checkAuth();
            setInitialLoadComplete(true);
        };

        checkAuthStatus();
    }, [checkAuth]);

    if(!initialLoadComplete) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">
            <Loader className="size-10 animate-spin"/>
        </div>
    )

    return (
        <>
        <Routes>
                <Route path="/" element={
                    !authUser ? (
                        <>
                            <Navbar />
                            <Home />
                            <Footer />
                        </>
                    ) : (
                        <Navigate to="/dashboard" />
                    )
                } />
                {/* Auth */}
                <Route path="/login" element={
                    !authUser ? <Login /> : <Navigate to={location.state?.from?.pathname || "/dashboard"} />
                } />
                <Route path="/register" element={
                    !authUser ? <Register /> : <Navigate to={location.state?.from?.pathname || "/dashboard"} />
                } />

                {/* Protected routes - with navbar */}
                <Route path="/*" element={
                    authUser ? (
                        <>
                            <Navbar />
                            <Routes>
                                {/* Pemain */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/main-menu" element={<MainMenu />} />
                                <Route path="/top-up" element={<TopUp />} />
                                <Route path="/profil" element={<Profil />} />
                                <Route path="/profiledit" element={<ProfilEdit />} />
                                <Route path="/ubahpassword" element={<EditPassword />} />

                                {/* Admin */}
                                <Route path="/main-menu-admin" element={<MainMenuAdmin />} />
                                <Route path="/daftarpemain" element={<DaftarPemain/>} />
                                <Route path="/admin/pemain/:userId" element={<DetailPemain />} />

                                {/* Games */}
                                <Route path="/jackpotadmin" element={<JackpotGameAdmin />} />
                                <Route path="/tebak-angkaadmin" element={<TebakAngkaAdmin />} />
                                
                                <Route path="/jackpot" element={<JackpotGame />} />
                                <Route path="/tebak-angka" element={<TebakAngka />} />
                                <Route path="/blackjack" element={<Blackjack />} />
                                <Route path="/dadu" element={<Dadu />} />
                            </Routes>
                            <Footer />
                        </>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;