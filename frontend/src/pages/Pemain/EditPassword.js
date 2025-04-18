import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useAuthStore} from "../../store/useAuthStore";
import toast from "react-hot-toast"; // pastikan lucide-react sudah terinstall

const EditPassword = () => {
    const navigate = useNavigate();

    const {authUser, updatePassword, isUpdatingProfile} = useAuthStore();

    const [formData, setFormData] = useState({
        password: "",
        newPassword: "",
    });

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const validateForm = () => {
        if (!formData.password || !formData.newPassword) {
            return toast.error("Semua field harus diisi.");
        }

        if (formData.newPassword.length < 8) {
            return toast.error("Password minimal 8 karakter.");
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleShowPassword1 = () => {
        setShowPassword1((prev) => !prev);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2((prev) => !prev);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const clear = validateForm();
        if (clear === true) {
            await updatePassword(formData, navigate);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-12">
            <div className="max-w-2xl mx-auto bg-[#1e1a18] rounded-2xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-center mb-8">Edit Password</h1>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block mb-1 text-sm text-gray-400">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword1 ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 pr-12 rounded-xl bg-[#2a2523] text-white border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword1}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword1 ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-400">Password Baru</label>
                        <div className="relative">
                            <input
                                type={showPassword2 ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full p-3 pr-12 rounded-xl bg-[#2a2523] text-white border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword2}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword2 ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-semibold transition w-full sm:w-auto"
                        >
                            {isUpdatingProfile ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                "Simpan Perubahan"
                            )}                        </button>

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

export default EditPassword;
