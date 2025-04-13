import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useDataStore = create((set, get) => ({
    users: [],
    saldo: null,
    isLoading: false,
    isUpdating: false,

    getUsers: async () => {
        set({isLoading: true})
        try {
            const res = await axiosInstance.get("/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading: false})
        }
    },

    getUser: async (userId) => {
        set({isLoading: true})
        try {
            const res = await axiosInstance.get(`/users/${userId}`)
            set({ user: res.data })
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading: false})
        }
    },

    addBalance: async (userId, amount) => {
        set({isUpdating: true})
        try {
            const res = await axiosInstance.post(`/users/${userId}/saldo`, { amount })
            toast.success("Saldo berhasil ditambahkan")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdating: false})
        }
    },

    getUserBalance: async () => {
        set({isLoading: true})
        try {
            const res = await axiosInstance.get(`/users/saldo`)
            set({ saldo: res.data })
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading: false})
        }
    }

}))