import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductBySlug } from '../services/api'
import { useCart } from '../context/CartContext'
import { buildBuyNowWhatsApp } from '../utils/whatsapp'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchProductBySlug(slug)
        setProduct(res.data.data)
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
          <div className="h-8 bg-gray-100 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    addToCart(product, selectedSize)
    toast.success(`Added to cart – Size ${selectedSize}`)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    window.open(buildBuyNowWhatsApp(product, selectedSize), '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative">
          <img
            src={product.images?.[0] || 'https://placehold.co/600x500?text=No+Image'}
            alt={product.name}
            className="w-full rounded-xl object-cover bg-gray-50 border border-gray-100"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider ${product.badge === 'hot' ? 'bg-red-500' : 'bg-primary'}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{product.brand}</p>
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-extrabold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                {discount && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">{discount}% OFF</span>}
              </>
            )}
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Select Size: {selectedSize && <span className="text-primary">EU {selectedSize}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg border-2 text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} className="btn-primary w-full py-3 text-base">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-whatsapp w-full py-3 text-base flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Buy Now via WhatsApp
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Orders processed via WhatsApp
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Fast delivery across India
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
