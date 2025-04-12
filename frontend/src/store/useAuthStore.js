import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    errorMessage: null,
    isLoggingIn: null,
    isRegistering: null,
    isCheckingAuth: false,
    isRefreshingToken: false,
    isUpdatingProfile: false,

    setRefreshingToken: (status) => {
        set({isRefreshingToken: status});
    },

    checkAuth: async () => {
        set({isCheckingAuth: true});
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            // Only set authUser to null if we're not refreshing the token
            if (!get().isRefreshingToken) {
                set({authUser: null});
            }
        } finally {
            set({isCheckingAuth: false});
        }
    },

    register: async (data, navigate) => {
        set({isRegistering: true});
        try {
            await axiosInstance.post("/auth/register", data);
            toast.success("Registrasi berhasil!");
            navigate("/login");
        } catch (error) {
            set({errorMessage: error.response.data.message});
            toast.error(error.response?.data?.message || "Register gagal");
        } finally {
            set({isRegistering: false});
        }
    },

    login: async (data, navigate) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success(`Selamat datang ${res.data.username}!`);
            navigate("/dashboard");
        } catch (error) {
            set({errorMessage: error.response.data.message});
            toast.error(error.response?.data?.message || "Login gagal");
        } finally {
            set({isLoggingIn: false});
        }
    },

    logout: async (options = { showToast: true }, navigate) => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            if (options.showToast) {
                toast.success("Berhasil logout.");
            }
        } catch (error) {
            set({errorMessage: error.response?.data?.message});
            if (options.showToast) {
                toast.error(error.response?.data?.message || "Logout failed");
            }
        }
    },

    deleteAccount: async ({navigate, id} = {}) => {
        const {authUser} = get();
        const target = id || authUser?.id
        try {
            // No need to pass ID - the server already knows the user from the JWT
            await axiosInstance.delete('/user/'+target);

            // Clear auth state
            set({authUser: null});

            toast.success("Akun Anda telah dihapus. Semoga tobatnya diterima. 😇");

            if (navigate) {
                navigate("/");
            }
        } catch (error) {
            console.error("Delete account error:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus akun");
        }
    },

    updateProfile: async (data, navigate) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/user/profile", data);
            get().checkAuth(); // Refresh auth state
            toast.success("Profil berhasil diperbarui!");
            navigate("/profil");
        } catch (error) {
            set({errorMessage: error.response.data.message});
            toast.error(error.response?.data?.message || "Gagal memperbarui profil");
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    updatePassword: async (data, navigate) => {
        set({isUpdatingProfile: true});
        try {
            await axiosInstance.put("/user/password", data);
            toast.success("Password berhasil diperbarui!");
            navigate("/profil");
        } catch (error) {
            set({errorMessage: error.response.data.message});
            toast.error(error.response?.data?.message || "Gagal memperbarui password");
        } finally {
            set({isUpdatingProfile: false});
        }
    },
}))