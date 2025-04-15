import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
    isUpdating: false,
    isLoading: false,
    isDeleting: false,
    isSettingAngkaAsli: false,

    addBalance: async (userId, amount) => {
        set({isUpdating: true})
        try {
            const res = await axiosInstance.post(`/admin/usersaldo/${userId}`, { amount })
            toast.success("Saldo berhasil ditambahkan")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdating: false})
        }
    },

    setWin: async (data) => {
        set({isUpdating: true})
        try {
            const res = await axiosInstance.post('/admin/jackpot/set', data)
            toast.success("Jackpot berhasil diatur")
            return res.data;
        } catch (e) {
            toast.error(e.response.data.message)
        } finally {
            set({isUpdating: false})
        }
    },

    getJackpotHistory: async () => {
        set({isLoading: true})
        try {
            const res = await axiosInstance.get('/admin/jackpot/')
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading: false})
        }
    },

    softDeleteJackpot: async (id) => {
        set({isDeleting: true})
        try {
            const res = await axiosInstance.put(`/admin/jackpot/${id}`)
            toast.success("Data jackpot berhasil dihapus")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isDeleting: false})
        }
    },

    getJackpotRecycleBin: async () => {
        set({isLoading: true})
        try {
            const res = await axiosInstance.get('/admin/jackpot/recyclebin')
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading: false})
        }
    },

    restoreJackpot: async (id) => {
        set({isUpdating: true})
        try {
            const res = await axiosInstance.put(`/admin/jackpot/recyclebin/${id}`)
            toast.success("Data jackpot berhasil dipulihkan")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdating: false})
        }
    },

    deleteJackpot: async (id) => {
        set({isDeleting: true})
        try {
            const res = await axiosInstance.delete(`/admin/jackpot/recyclebin/${id}`)
            toast.success("Data jackpot berhasil dihapus permanen")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isDeleting: false})
        }
    },

    setAngkaAsli: async (data) => {
        set({isSettingAngkaAsli: true})
        const d = {
            angkaAsli: data
        }
        try {
            const res = await axiosInstance.post('/admin/lottery/finish', d)
            toast.success("Nomer berhasil disimpan")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isSettingAngkaAsli: false})
        }
    }

}))