import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { fetchProducts } from '../services/api'

const CATEGORY_NAMES = {
  'ua-top-batch': 'UA Top Batch',
  'womens-kick': "Women's Kick",
  'mens-kick': "Men's Kick",
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchProducts({ category: slug })
        setProducts(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {CATEGORY_NAMES[slug] || 'Products'}
      </h1>
      <p className="text-sm text-gray-400 mb-6">{products.length} products</p>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
