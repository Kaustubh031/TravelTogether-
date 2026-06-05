import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('tt_user')
    return u ? JSON.parse(u) : null
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('tt_token', data.token)
    localStorage.setItem('tt_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form)
    localStorage.setItem('tt_token', data.token)
    localStorage.setItem('tt_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('tt_token')
    localStorage.removeItem('tt_user')
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
