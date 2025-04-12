import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";
import {useAuthStore} from "./useAuthStore.js";

export const useDataStore = create((set, get) => ({
    users: [],
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

}))