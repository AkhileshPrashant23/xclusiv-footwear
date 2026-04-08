import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { fetchProducts } from '../services/api'

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'UA Top Batch', value: 'ua-top-batch' },
  { label: "Women's Kick", value: 'womens-kick' },
  { label: "Men's Kick", value: 'mens-kick' },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(12)

  useEffect(() => {
    loadProducts(activeCategory)
    setVisibleCount(12)
  }, [activeCategory])

  const loadProducts = async (cat) => {
    setLoading(true)
    try {
      const params = cat !== 'all' ? { category: cat } : {}
      const res = await fetchProducts(params)
      setProducts(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block bg-white text-primary text-xs font-bold px-3 py-1 rounded mb-3 uppercase tracking-widest">
              New Arrivals 2025-26
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Step Into<br />
              <span className="text-[#25D366]">Fresh Kicks</span>
            </h1>
            <p className="text-gray-400 text-sm mt-3 mb-5 max-w-sm leading-relaxed">
              Premium sneakers & UA top batch — Jordans, Dunks, Sambas. Fast delivery across India.
            </p>
            <button
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#25D366] text-white font-bold text-sm px-6 py-3 rounded-md hover:bg-[#1ebe5d] transition-colors"
            >
              Shop Now
            </button>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 rounded-xl w-28 h-28 flex items-center justify-center text-5xl">👟</div>
            <div className="bg-white/10 rounded-xl w-28 h-28 flex items-center justify-center text-5xl mt-6">👠</div>
          </div>
        </div>
      </div>

      {/* Category Nav Bar — exact like original */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 text-sm font-semibold px-5 py-4 border-b-2 transition-colors ${
                  activeCategory === cat.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products-section" className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trending Products</h2>
            <p className="text-sm text-gray-400 mt-0.5">Our trends that customers love!</p>
          </div>
          <Link to="/" className="text-sm text-[#25D366] font-semibold hover:underline">
            View All
          </Link>
        </div>

        <ProductGrid products={products.slice(0, visibleCount)} loading={loading} />

        {!loading && visibleCount < products.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 8)}
              className="btn-primary px-8"
            >
              View More
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button */}
      <a
        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] transition-colors z-50"
        title="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
