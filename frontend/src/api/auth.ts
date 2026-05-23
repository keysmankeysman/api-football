import { backendApi } from './axios'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types'

export const authAPI = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await backendApi.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
        })
        
        const { data } = response.data
        
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken)
        }
        
        const user: User = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.email.split('@')[0],
            token: data.accessToken
        }
        
        return {
            user,
            token: data.accessToken
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await backendApi.post('/auth/register', {
            email: data.email,
            password: data.password
        })
        
        const { data: responseData } = response.data
        
        if (responseData.refreshToken) {
            localStorage.setItem('refreshToken', responseData.refreshToken)
        }
        
        const user: User = {
            id: responseData.user.id,
            email: responseData.user.email,
            username: data.username,
            token: responseData.accessToken
        }
        
        return {
            user,
            token: responseData.accessToken
        }
    },

    async logout(): Promise<void> {
        try {
            await backendApi.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('refreshToken')
        }
    },

    async verifyToken(token: string): Promise<boolean> {
        try {
            await backendApi.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            return true
        } catch {
            return false
        }
    },
    
    async getMe(): Promise<User | null> {
        try {
            const response = await backendApi.get('/auth/me')
            const { user } = response.data.data
            return {
                id: user.id,
                email: user.email,
                username: user.email.split('@')[0],
                token: localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY) || undefined
            }
        } catch {
            return null
        }
    },
    
    async updateProfile(email?: string, password?: string): Promise<User | null> {
        try {
            const response = await backendApi.put('/auth/profile', { email, password })
            const { user } = response.data.data
            return {
                id: user.id,
                email: user.email,
                username: user.email.split('@')[0],
                token: localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY) || undefined
            }
        } catch {
            return null
        }
    }
}