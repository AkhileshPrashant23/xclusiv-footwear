import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Products
export const fetchProducts = (params) => API.get('/products', { params })
export const fetchProductBySlug = (slug) => API.get(`/products/${slug}`)

// Categories
export const fetchCategories = () => API.get('/categories')

// Orders
export const createOrder = (data) => API.post('/orders', data)

export default API
