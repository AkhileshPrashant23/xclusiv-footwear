import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.jpeg'

const TABS = ['Products', 'Add Product', 'Orders', 'Users']
const CATEGORIES = [
  { label: 'UA Top Batch', value: 'ua-top-batch' },
  { label: "Women's Kick", value: 'womens-kick' },
  { label: "Men's Kick", value: 'mens-kick' },
]
const STATUS_OPTS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// ─── Reusable input ───────────────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
    </div>
  )
}

// ─── Add / Edit Product Form ──────────────────────────────────────────────────
function ProductForm({ initial, onSaved, onCancel }) {
  const isEdit = !!initial
  const [form, setForm] = useState(
    initial || { name: '', brand: '', price: '', originalPrice: '', category: 'mens-kick', sizes: '', badge: '', description: '' }
  )
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState(initial?.images || [])
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFiles = (e) => {
    const f = Array.from(e.target.files)
    setFiles(f)
    setPreviews(f.map((x) => URL.createObjectURL(x)))
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.brand || !form.price || !form.sizes) { toast.error('Fill required fields'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      const sizesArr = form.sizes.toString().split(',').map((s) => s.trim()).filter(Boolean)
      fd.set('sizes', JSON.stringify(sizesArr.map(Number)))
      files.forEach((f) => fd.append('images', f))

      if (isEdit) {
        await API.put(`/products/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product updated!')
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product added!')
      }
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Product Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Air Jordan 1 Retro High" />
        </div>
        <Input label="Brand *" name="brand" value={form.brand} onChange={handleChange} placeholder="Nike / Adidas" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <Input label="Price (₹) *" name="price" type="number" value={form.price} onChange={handleChange} placeholder="2800" />
        <Input label="Original Price (₹)" name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="4500" />
        <Input label="Sizes * (comma separated)" name="sizes" value={form.sizes} onChange={handleChange} placeholder="41, 42, 43, 44, 45" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Badge</label>
          <select name="badge" value={form.badge} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">None</option>
            <option value="new">New</option>
            <option value="hot">Hot</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Input label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Optional product description" />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Images</label>
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-400">Click to upload images <span className="text-gray-300">(max 5)</span></p>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </div>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')

  const loadAll = async () => {
    setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([API.get('/products'), API.get('/orders')])
      setProducts(pRes.data.data)
      setOrders(oRes.data.data)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => { loadAll() }, [])
  useEffect(() => {
  if (admin?.token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`
  }
  loadAll()
}, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      toast.success('Product deleted')
      setProducts((p) => p.filter((x) => x._id !== id))
    } catch { toast.error('Delete failed') }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status })
      setOrders((o) => o.map((x) => x._id === orderId ? { ...x, status } : x))
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
  }

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Products', value: products.length, icon: '👟' },
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, icon: '⏳' },
    { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-800">
          <img src={logo} alt="Xclusiv" className="h-10 w-auto object-contain  " />
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setEditProduct(null) }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              {t === 'Products' && '📦 '}
              {t === 'Add Product' && '➕ '}
              {t === 'Orders' && '🛒 '}
              {t === 'Users' && '👥 '}
              {t}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-3">Logged in as Admin</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900">{editProduct ? 'Edit Product' : tab}</h1>
          <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Store
          </a>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Products Tab */}
          {tab === 'Products' && !editProduct && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button onClick={() => setTab('Add Product')} className="bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors shrink-0">
                  + Add Product
                </button>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Sizes</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.images?.[0] || 'https://placehold.co/40x40?text=Shoe'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate max-w-[180px]">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.category}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">₹{p.price?.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.sizes?.join(', ')}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditProduct(p); setTab('Products') }} className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(p._id)} className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No products found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Edit Product inline */}
          {tab === 'Products' && editProduct && (
            <ProductForm
              initial={{ ...editProduct, sizes: editProduct.sizes?.join(', ') }}
              onSaved={() => { setEditProduct(null); loadAll() }}
              onCancel={() => setEditProduct(null)}
            />
          )}

          {/* Add Product Tab */}
          {tab === 'Add Product' && (
            <ProductForm onSaved={() => { setTab('Products'); loadAll() }} />
          )}

          {/* Orders Tab */}
          {tab === 'Orders' && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No orders yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-semibold text-gray-700">#{o._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="font-medium text-gray-800">{o.customerName || 'Guest'}</p>
                          <p className="text-xs text-gray-400">{o.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[o.status]}`}
                          >
                            {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Users Tab */}
          {tab === 'Users' && (
            <div>
              <UsersTab />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/auth/users').then(r => setUsers(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.filter(u => u.role !== 'admin').map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {u.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{u.fullName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{u.email}</td>
              <td className="px-4 py-3 text-gray-600">{u.phone}</td>
              <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
          {users.filter(u => u.role !== 'admin').length === 0 && (
            <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-sm">No users registered yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
