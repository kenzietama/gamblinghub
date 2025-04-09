import React from "react";
import Navbar from "../../components/navbar";

const TopUp = () => {
  const steps = [
    "Login ke akun GamblingHub Anda terlebih dahulu.",
    "Pastikan saldo Anda kurang atau perlu ditambahkan.",
    "Buka aplikasi mobile banking atau ATM Anda.",
    "Lakukan transfer pada e-wallet atau akun bank di bawah ini.",
    "Minimal top up adalah Rp 10.000.",
    "Sertakan email dan username pada transaksi.",
    "Simpan bukti transfer (screenshot atau foto).",
    "Tunggu admin memverifikasi top up Anda dalam 5-10 menit.",
    "Saldo akan otomatis bertambah jika berhasil.",
    "Jika ada kendala, hubungi admin melalui live chat.",
  ];

  const metodePembayaran = [
    { jenis: "Bank BCA", detail: "1234567890 a.n GamblingHub Indonesia" },
    { jenis: "Bank BRI", detail: "0987654321 a.n GamblingHub Indonesia" },
    { jenis: "Bank Mandiri", detail: "1122334455 a.n GamblingHub Indonesia" },
    { jenis: "Bank BNI", detail: "5566778899 a.n GamblingHub Indonesia" },
    { jenis: "DANA", detail: "0812-3456-7890 a.n GamblingHub Ewallet" },
    { jenis: "OVO", detail: "0813-9876-5432 a.n GamblingHub Ewallet" },
    { jenis: "GoPay", detail: "0899-1122-3344 a.n GamblingHub Ewallet" },
    { jenis: "PayPal", detail: "paypal@gamblinghub.com" },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12 space-y-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-4">
            Cara Top Up Saldo Permainan Anda
          </h1>
          <p className="text-center text-gray-300 mb-10">
            Ikuti langkah-langkah berikut untuk menambah saldo akun Anda dan bermain lebih banyak game seru!
          </p>

          <ol className="list-decimal list-inside space-y-4 text-gray-200">
            {steps.map((step, index) => (
              <li key={index} className="bg-[#1e1a18] p-4 rounded-lg shadow-md">
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-14 bg-[#2c2623] p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-4 text-center">Rekening & E-Wallet Tujuan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metodePembayaran.map((metode, index) => (
                <div
                  key={index}
                  className="bg-black/30 p-4 rounded-lg border border-gray-700 hover:bg-black/50 transition"
                >
                  <h3 className="text-lg font-bold">{metode.jenis}</h3>
                  <p className="text-sm text-gray-300">{metode.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default TopUp;
