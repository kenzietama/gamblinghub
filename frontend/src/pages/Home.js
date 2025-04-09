import React from "react";
import { Link } from "react-router-dom";
import logo from "../Picture/logogamblinghub.png";
import video from "../Picture/videogamblinghub.mp4";

// Import komponen tambahan
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Gameslide from "../components/gameslide";

// Fungsi pembangkit angka pseudo-random berbasis string
const seededRandomNumber = (seedStr) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 9000) + 1000; // hasil 4 digit
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
const todaySeedFormat = todayDate.toISOString().split("T")[0];

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

                {/* Section: Logo dan Pengenalan */}
                <section className="text-center px-4 py-10">
                    <img src={logo} alt="Logo" className="mx-auto mb-6 w-18 h-24 object-contain" />

                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
                        {/* Video */}
                        <div className="w-full md:w-5/12 flex justify-center">
                            <video
                                src={video}
                                className="rounded-xl shadow-lg w-[85%] h-auto"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        </div>

                        {/* Teks */}
                        <div className="w-full md:w-5/12 text-justify">
                            <h2 className="text-indigo-300 text-lg leading-relaxed">
                                Gambling Hub adalah destinasi utama bagi para pecinta judi online yang mencari pengalaman bermain terbaik, aman, dan terpercaya.
                                Sebagai salah satu platform terlengkap di Indonesia, Gambling Hub menghadirkan berbagai jenis permainan menarik seperti slot online gacor,
                                taruhan bola, poker, live casino, hingga tembak ikan. Dengan tampilan yang user-friendly dan sistem yang cepat serta responsif,
                                kami memastikan setiap pemain bisa menikmati hiburan tanpa hambatan. Selain itu, Gambling Hub juga menawarkan berbagai promo menarik seperti
                                bonus new member, cashback harian, dan jackpot progresif yang siap diburu kapan saja. Dengan dukungan customer service 24 jam nonstop,
                                kami hadir untuk memberikan layanan terbaik dan menjamin setiap kemenangan Anda dibayar penuh tanpa delay.
                                <strong> Bergabunglah sekarang di Gambling Hub dan rasakan sendiri sensasi berjudi online yang seru dan menguntungkan!</strong>
                            </h2>
                        </div>
                    </div>
                </section>

                {/* Section: Game Slider */}
                <section className="max-w-5xl mx-auto mt-20">
                    <Gameslide />
                </section>

                {/* Section: Tabel Angka */}
                <section className="max-w-4xl mx-auto">
                    <h1 className="text-center text-4xl font-bold mb-4">Keluaran Angka Togel</h1>

                    <div className="grid grid-cols-3 font-semibold text-indigo-200 border-b border-indigo-600 pb-2 mb-2">
                        <div className="text-left">Negara</div>
                        <div className="text-center">Angka</div>
                        <div className="text-right">Tanggal</div>
                    </div>

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
