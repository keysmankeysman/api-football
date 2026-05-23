import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authAPI } from '@/api/auth'
import router from '@/router'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const currentUser = computed(() => user.value)

    const initAuth = async () => {
        const storedToken = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
        const storedUser = localStorage.getItem(import.meta.env.VITE_AUTH_USER_KEY)

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
            
            const isValid = await authAPI.verifyToken(storedToken)
            if (!isValid) {
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    try {
                        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
                            refreshToken
                        })
                        const newToken = response.data.data.accessToken
                        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, newToken)
                        token.value = newToken
                    } catch {
                        logout()
                    }
                } else {
                    logout()
                }
            }
        }
    }

    const login = async (credentials: LoginCredentials) => {
        loading.value = true
        error.value = null

        try {
            const response = await authAPI.login(credentials)
            user.value = response.user
            token.value = response.token

            localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, response.token)
            localStorage.setItem(import.meta.env.VITE_AUTH_USER_KEY, JSON.stringify(response.user))

            await router.push('/dashboard')
            return true
        } catch (err: any) {
            error.value = err.message || 'Ошибка входа'
            return false
        } finally {
            loading.value = false
        }
    }

    const register = async (data: RegisterData) => {
        loading.value = true
        error.value = null

        try {
            const response = await authAPI.register(data)
            user.value = response.user
            token.value = response.token

            localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, response.token)
            localStorage.setItem(import.meta.env.VITE_AUTH_USER_KEY, JSON.stringify(response.user))

            await router.push('/dashboard')
            return true
        } catch (err: any) {
            error.value = err.message || 'Ошибка регистрации'
            return false
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true

        try {
            await authAPI.logout()
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            user.value = null
            token.value = null
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
            localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY)
            localStorage.removeItem('refreshToken') 
            await router.push('/login')
            loading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        currentUser,
        initAuth,
        login,
        register,
        logout,
        clearError
    }
})