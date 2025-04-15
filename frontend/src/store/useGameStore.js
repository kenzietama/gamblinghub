import {create} from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useGameStore = create((set, get) => ({
    bet: 0,
    jackpotId: null,
    result: null,
    isUpdatingBalance: false,
    isUpdatingLottery: false,
    isLoadingLottery: false,

    setBet: (amount) => {
        set({bet: amount})
    },

    setResult: (result) => {
        set({result: result})
    },

    updateBalance: async(win = false, multiplier = 2) => {
        set({isUpdatingBalance: true})
        try {
            let amount;
            if (win) {
                amount = get().bet * multiplier - get().bet;
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

    playJackpot: async () => {
        try {
            const res = await axiosInstance.get("/games/playjackpot")
            set({ jackpotId: res.data.id })
            return res.data;
        } catch (error) {
            console.error("Error saving jackpot history:", error);
        } finally {

        }
    },

    saveJackpotHistory: async () => {
        try {
            await axiosInstance.post(`/games/playjackpot/${get().jackpotId}/${get().result}`)
        } catch (error) {
            console.error("Error saving jackpot history:", error);
        } finally {
            set({ jackpotId: null })
            set({ result: null })
        }
    },

    setLottery: async (data) => {
        set({isUpdatingLottery: true})
        try {
            console.log(data)
            await axiosInstance.post("/games/lottery", data)
            toast.success("Nomer berhasil disimpan")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingLottery: false})
        }
    },

    getUserLottery: async () => {
        set({isLoadingLottery: true})
        try {
            const res = await axiosInstance.get("/games/lottery")
            return res.data;
        } catch (error) {
            console.error("Error fetching user lottery:", error);
            // toast.error(error.response.data.message)
        } finally {
            set({isLoadingLottery: false})
        }
    },

    getCurrentLottery: async () => {
        set({isLoadingLottery: true})
        try {
            const res = await axiosInstance.get("/admin/lottery")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoadingLottery: false})
        }
    }

}))