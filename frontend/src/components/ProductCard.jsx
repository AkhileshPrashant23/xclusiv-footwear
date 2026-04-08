import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { buildBuyNowWhatsApp } from '../utils/whatsapp'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    addToCart(product, selectedSize)
    toast.success(`Added to cart – Size ${selectedSize}`)
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    const url = buildBuyNowWhatsApp(product, selectedSize)
    window.open(url, '_blank')
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover bg-gray-50"
          loading="lazy"
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              product.badge === 'hot' ? 'bg-red-500' : 'bg-primary'
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 hover:text-black">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-3">
          <p className="text-[11px] text-gray-400 font-medium mb-1.5">Size :</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`size-chip ${selectedSize === size ? 'size-chip-active' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <button onClick={handleAddToCart} className="btn-primary w-full text-center">
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-whatsapp w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
