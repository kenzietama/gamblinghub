import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {useAuthStore} from "../../store/useAuthStore"; // pastikan lucide-react sudah terinstall

const ProfileEdit = () => {
  const navigate = useNavigate();
  const {authUser} = useAuthStore()

  const [formData, setFormData] = useState({
    email: authUser.email,
    username: authUser.username,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profil berhasil diperbarui!");
    navigate("/profil");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
        <div className="max-w-2xl mx-auto bg-[#1e1a18] rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-8">Edit Profil</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#2a2523] text-white border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-400">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#2a2523] text-white border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 rounded-xl bg-[#2a2523] text-white border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-semibold transition w-full sm:w-auto"
              >
                Simpan Perubahan
              </button>

              <button
                type="button"
                onClick={() => navigate("/profil")}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-white font-semibold transition w-full sm:w-auto"
              >
              Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ProfileEdit;
