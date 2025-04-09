import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1e1a18] text-white text-sm pt-12 pb-8 px-4 md:px-16">
      {/* Section 1: Metode Pembayaran */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Metode Pembayaran</p>
        <div className="flex flex-wrap gap-4 items-center">
          <img src="https://files.sitestatic.net/sprites/bank_logos/bank_col.jpg?v=4" alt="Bank" className="h-10" />
          <img src="https://files.sitestatic.net/sprites/bank_logos/ewallet_col.jpg?v=4" alt="Ewallet" className="h-10" />
          <img src="https://files.sitestatic.net/sprites/bank_logos/pulsa_col.jpg?v=4" alt="Pulsa" className="h-10" />
          <img src="https://files.sitestatic.net/sprites/bank_logos/payment_types/qris_col.webp" alt="QRIS" className="h-10" />
        </div>
      </div>

      <div className="border-t border-gray-600 my-6"></div>

      {/* Section 2: Navigasi dan Hak Cipta */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2 md:gap-0 mb-8">
        <p className="text-sm">Tentang Kami | Info Perbankan | Pusat Info | Hubungi Kami</p>
        <p className="text-gray-400 text-xs">©2025 Gambling69Hub. Seluruh hak cipta | 18+ | v1.0</p>
      </div>

      <div className="border-t border-gray-600 my-6"></div>

      {/* Section 3: Game Providers */}
      <p className="font-semibold mb-2">Game Providers</p>
      <div className="flex justify-center">
        <img
          src="https://files.sitestatic.net/images/footer_provider_white.png?v=0.5"
          alt="Gigagaming"
          className="h-100 object-contain"
        />
      </div>
    </footer>
  );
};

export default Footer;
