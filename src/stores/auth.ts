import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authAPI } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const currentUser = computed(() => user.value)

    // Инициализация из localStorage
    const initAuth = () => {
        const storedToken = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
        const storedUser = localStorage.getItem(import.meta.env.VITE_AUTH_USER_KEY)

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }

    // Логин
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

    // Регистрация
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

    // Логаут
    const logout = async () => {
        loading.value = true

        try {
            await authAPI.logout()
        } finally {
            user.value = null
            token.value = null
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
            localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY)
            await router.push('/login')
            loading.value = false
        }
    }

    // Очистка ошибок
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