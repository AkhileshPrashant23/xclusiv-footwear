import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

export let _cartClearFn = null

export const clearCartStorage = () => {
  localStorage.removeItem('xclusiv_cart')
  if (_cartClearFn) _cartClearFn()
}

const initialState = {
  items: JSON.parse(localStorage.getItem('xclusiv_cart') || '[]'),
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload
      const existing = state.items.find(
        (i) => i._id === product._id && i.selectedSize === size
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === product._id && i.selectedSize === size
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...product, selectedSize: size, qty: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i._id === action.payload.id && i.selectedSize === action.payload.size)
        ),
      }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.id && i.selectedSize === action.payload.size
            ? { ...i, qty: action.payload.qty }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

useEffect(() => {
    _cartClearFn = () => dispatch({ type: 'CLEAR_CART' })
    return () => { _cartClearFn = null }
  }, [])

  const addToCart = (product, size) => dispatch({ type: 'ADD_ITEM', payload: { product, size } })
  const removeFromCart = (id, size) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } })
  const updateQty = (id, size, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, size, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((acc, i) => acc + i.qty, 0)
  const totalAmount = state.items.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
