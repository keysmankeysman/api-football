import api from './axios'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types'

// Эмуляция JWT авторизации (так как у нас нет реального бэкенда)
// В реальном проекте здесь были бы реальные API вызовы

const MOCK_USERS = new Map()

export const authAPI = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Эмуляция API запроса
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockToken = btoa(`${credentials.email}:${Date.now()}`)
                const mockUser: User = {
                    id: Date.now(),
                    email: credentials.email,
                    username: credentials.email.split('@')[0],
                    token: mockToken
                }

                if (credentials.email === 'test@test.com' && credentials.password === '123456') {
                    resolve({ user: mockUser, token: mockToken })
                } else {
                    reject(new Error('Неверный email или пароль'))
                }
            }, 500)
        })
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockToken = btoa(`${data.email}:${Date.now()}`)
                const mockUser: User = {
                    id: Date.now(),
                    email: data.email,
                    username: data.username,
                    token: mockToken
                }

                resolve({ user: mockUser, token: mockToken })
            }, 500)
        })
    },

    async logout(): Promise<void> {
        return Promise.resolve()
    },

    async verifyToken(token: string): Promise<boolean> {
        return Promise.resolve(!!token)
    }
}