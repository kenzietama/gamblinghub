import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useGameStore = create((set, get) => ({
    isUpdatingBalance: false,
    bet: 0,

    setBet: (amount) => {
        set({bet: amount})
    },

    updateBalance: async(win = false) => {
        set({isUpdatingBalance: true})
        try {
            let amount;
            if (win) {
                amount = get().bet;
            } else {
                amount = -get().bet;
            }
            const res = await axiosInstance.post("/games/updatebalance", { amount })
            toast.success("Saldo berhasil diperbarui")
            set({bet: 0})
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingBalance: false})
        }
    },
}))