import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { buildCartWhatsApp } from '../utils/whatsapp'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalAmount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }
    try {
      // Save order to DB
      const orderPayload = {
        customerName: user.fullName,
        customerPhone: user.phone,
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          size: i.selectedSize,
          quantity: i.qty,
          image: i.images?.[0] || '',
        })),
        totalAmount,
      }
      await API.post('/orders', orderPayload)
    } catch (err) {
      console.error('Order save error:', err)
    }
    const url = buildCartWhatsApp(items, totalAmount)
    window.open(url, '_blank')
    clearCart()
    toast.success('Order sent to WhatsApp!')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-6">Add some kicks and come back!</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8">Shop Now</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item._id}-${item.selectedSize}`} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <img src={item.images?.[0] || 'https://placehold.co/100x100?text=Shoe'} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.brand}</p>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Size: <span className="font-semibold text-gray-700">{item.selectedSize}</span></p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => item.qty > 1 ? updateQty(item._id, item.selectedSize, item.qty - 1) : removeFromCart(item._id, item.selectedSize)} className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-100">−</button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.selectedSize, item.qty + 1)} className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-100">+</button>
                    <button onClick={() => removeFromCart(item._id, item.selectedSize)} className="ml-2 text-red-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate max-w-[160px]">{item.name.split(' ').slice(0,3).join(' ')}… ×{item.qty}</span>
                  <span className="font-medium">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mb-5">
              <div className="flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Shipping calculated on WhatsApp</p>
            </div>
            {!user && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                Login required to place order
              </p>
            )}
            <button onClick={handleCheckout} className="btn-whatsapp w-full py-3 text-base flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order via WhatsApp
            </button>
            <button onClick={() => navigate('/')} className="w-full mt-2 text-sm text-gray-500 hover:text-black py-2 transition-colors">← Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  )
}
