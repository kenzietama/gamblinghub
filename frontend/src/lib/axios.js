import axios from "axios"

let isRefreshing = false;
let failedQueue = [];

// Store a reference to the logout function without importing store
let logoutFn = null;
let setRefreshingTokenFn = null;

export const setLogoutFunction = (fn) => {
    logoutFn = fn;
};

export const setRefreshingTokenFunction = (fn) => {
    setRefreshingTokenFn = fn;
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// frontend/src/lib/axios.js
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip for login and register
        if (
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register')
        ) {
            return Promise.reject(error);
        }

        // IMPORTANT: Set refreshing flag BEFORE checking response status
        // This helps prevent race conditions with checkAuth
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshing &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            // Set refreshing token flag IMMEDIATELY
            if (setRefreshingTokenFn) {
                setRefreshingTokenFn(true);
            }

            // Small delay to ensure refreshing flag is processed
            await new Promise(resolve => setTimeout(resolve, 50));

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post("/auth/refresh");
                isRefreshing = false;

                if (setRefreshingTokenFn) {
                    setRefreshingTokenFn(false);
                }

                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                if (setRefreshingTokenFn) {
                    setRefreshingTokenFn(false);
                }
                processQueue(refreshError);

                if (logoutFn) {
                    logoutFn({ showToast: false });
                } else {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;