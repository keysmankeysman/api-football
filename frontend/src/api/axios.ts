import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
})

// Для запросов к бэкенду (авторизация)
export const backendApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
})

// Request interceptor для backendApi (добавляем токен)
backendApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response interceptor для backendApi (обработка 401 и refresh токена)
let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

backendApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если уже идет обновление, добавляем в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers!.Authorization = `Bearer ${token}`
                    return backendApi(originalRequest)
                }).catch(err => Promise.reject(err))
            }
            
            originalRequest._retry = true
            isRefreshing = true
            
            const refreshToken = localStorage.getItem('refreshToken')
            
            if (!refreshToken) {
                // Нет refresh токена - принудительный выход
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
                localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY)
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(error)
            }
            
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
                    refreshToken
                })
                
                const newAccessToken = response.data.data.accessToken
                localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, newAccessToken)
                
                // Обрабатываем очередь запросов
                processQueue(null, newAccessToken)
                
                // Повторяем исходный запрос
                originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`
                return backendApi(originalRequest)
            } catch (refreshError) {
                // Refresh токен тоже протух - выходим
                processQueue(refreshError as Error, null)
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
                localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY)
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }
        
        return Promise.reject(error)
    }
)

// Старый интерцептор для TheSportsDB API (без авторизации)
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
)

export default api