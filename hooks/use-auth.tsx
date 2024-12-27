import { create } from 'zustand'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

interface AuthState {
    isAuthenticated: boolean
    userId: string
    checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    userId: '',

    checkAuth: () => {
        const authToken = Cookies.get('client_auth_token')
        if (authToken) {
            const decodedToken = jwt.decode(authToken) as { userId: string }
            set({
                isAuthenticated: true,
                userId: decodedToken?.userId || ''
            })
        } else {
            set({
                isAuthenticated: false,
                userId: ''
            })
        }
    }
}))