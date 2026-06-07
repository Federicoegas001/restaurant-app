import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  const login = (usuarioData) => {
    // Nunca guardar la contraseña en el cliente
    const { password, ...usuarioSeguro } = usuarioData
    setUsuario(usuarioSeguro)
    localStorage.setItem('usuario', JSON.stringify(usuarioSeguro))
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  const isAdmin = usuario?.rol === 'ADMIN'
  const isCliente = usuario?.rol === 'CLIENTE'

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin, isCliente }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
