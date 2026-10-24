
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '../types/Auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('auth')

    if (!saved) return null

    try {
      return JSON.parse(saved) as AuthUser
    } catch {
      localStorage.removeItem('auth')
      return null
    }
  })

  const login = (user: AuthUser) => {
    setUser(user)
    localStorage.setItem('auth', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}


/*import { createContext, useContext, useState, ReactNode } from 'react'
import type { AuthUser } from '../types/Auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (u: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lê o localStorage na 1ª renderização (mantém login após F5)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('auth')
    return saved ? JSON.parse(saved) : null
  })

  const login = (u: AuthUser) => {
    setUser(u)
    localStorage.setItem('auth', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: user !== null, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}*/