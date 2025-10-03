import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthCtx = {
  token: string | null
  login: (token: string) => void
  logout: () => void
}
const Ctx = createContext<AuthCtx>({ token: null, login: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])
  const login = (t: string) => setToken(t)
  const logout = () => setToken(null)
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
