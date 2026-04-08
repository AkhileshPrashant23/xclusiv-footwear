import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('xclusiv_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('xclusiv_user', JSON.stringify(userData))
    if (userData?.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    }
  }

  // Set token on mount
  useEffect(() => {
    if (user?.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    }
  }, [])

  const register = async (formData) => {
    setLoading(true)
    try {
      const res = await API.post('/auth/register', formData)
      saveUser(res.data.data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const login = async (phone, password) => {
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { phone, password })
      saveUser(res.data.data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const adminLogin = async (adminId, password) => {
    setLoading(true)
    try {
      const res = await API.post('/auth/admin-login', { adminId, password })
      saveUser(res.data.data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid admin credentials' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('xclusiv_user')
    delete API.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, adminLogin, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
