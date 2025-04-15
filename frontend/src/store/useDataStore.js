import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useDataStore = create((set, get) => ({
    users: [],
    saldo: null,
    isLoading: false,

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