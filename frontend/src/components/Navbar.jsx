import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import logo from '../assets/logo.jpeg'

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Xclusiv Footwear" className="h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/category/ua-top-batch" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">UA Top Batch</Link>
          <Link to="/category/womens-kick" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Women's Kick</Link>
          <Link to="/category/mens-kick" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Men's Kick</Link>
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">All Categories</Link>
          {user && (
            <Link to="/my-orders" className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              My Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black px-3 py-2 rounded-md hover:bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline">{user.fullName?.split(' ')[0]}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <Link to="/my-orders" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-gray-700 hover:text-black px-3 py-2 rounded-md hover:bg-gray-50">
              Login
            </Link>
          )}

          <button onClick={() => navigate('/cart')} className="relative flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="bg-[#25D366] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </button>

          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-black" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link to="/category/ua-top-batch" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-1">UA Top Batch</Link>
          <Link to="/category/womens-kick" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-1">Women's Kick</Link>
          <Link to="/category/mens-kick" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-1">Men's Kick</Link>
          {user && <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-1">My Orders</Link>}
          {!user && <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-1">Login / Sign Up</Link>}
          {user && <button onClick={handleLogout} className="text-sm font-medium text-red-500 py-1 text-left">Logout</button>}
        </div>
      )}
    </header>
  )
}
