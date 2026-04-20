import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'
import { clearCartStorage } from './CartContext'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('xclusiv_user')
    return stored ? JSON.parse(stored) : null
  })

  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('xclusiv_admin')
    return stored ? JSON.parse(stored) : null
  })

  const [loading, setLoading] = useState(false)

  // Set token on mount
  useEffect(() => {
    const token = admin?.token || user?.token
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('xclusiv_user', JSON.stringify(userData))
    if (!admin?.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    }
  }

  const saveAdmin = (adminData) => {
    setAdmin(adminData)
    localStorage.setItem('xclusiv_admin', JSON.stringify(adminData))
    API.defaults.headers.common['Authorization'] = `Bearer ${adminData.token}`
  }

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
      saveAdmin(res.data.data)
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
    clearCartStorage()
    if (admin?.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`
    } else {
      delete API.defaults.headers.common['Authorization']
    }
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('xclusiv_admin')
    if (user?.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    } else {
      delete API.defaults.headers.common['Authorization']
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        register,
        login,
        adminLogin,
        logout,
        adminLogout,
        isAdmin: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)