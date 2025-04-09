import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const Gameslide = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: "🎰 Jackpot",
      desc: "Coba keberuntunganmu pada mesin jackpot yang menyenangkan!",
      path: "/jackpot",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      name: "🔢 Tebak Angka",
      desc: "Tebak angka 4 digit dan menangkan hadiah!",
      path: "/tebak-angka",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      name: "🎲 Lempar Dadu",
      desc: "Lempar dadu dan menang bila jumlahnya besar, ayo!",
      path: "/dadu",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "🃏 Blackjack",
      desc: "Kalahkan dealer di dalam sebuah permainan blackjack!",
      path: "/blackjack",
      color: "from-blue-400 to-blue-600",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="px-6 py-12 !bg-transparent">
      <h1 className="text-center text-4xl font-bold mb-4">Pilihan Permainan</h1>
      <Slider {...settings}>
        {games.map((game, index) => (
          <div key={index} className="px-2">
            <div
              onClick={() => navigate(game.path)}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300`}
            >
              <h2 className="text-xl font-bold mb-2">{game.name}</h2>
              <p className="text-sm">{game.desc}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Gameslide;
