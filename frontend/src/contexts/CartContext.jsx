import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer para manejar el estado del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { producto } = action.payload;
      const existingItem = state.items.find(item => item.id === producto.id);
      const maxStock = Number((existingItem && existingItem.stock) ?? producto.stock ?? Infinity);
      if (existingItem) {
        if (existingItem.cantidad >= maxStock) {
          return state;
        }
        return {
          ...state,
          items: state.items.map(item =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        };
      } else {
        if (Number(producto.stock ?? 0) <= 0) {
          return state;
        }
        return {
          ...state,
          items: [...state.items, {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio_oferta || producto.precio,
            precio_original: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
            stock: Number(producto.stock ?? 0)
          }]
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, cantidad } = action.payload;
      const item = state.items.find(i => i.id === id);
      const maxStock = Number(item?.stock ?? Infinity);
      const nextCantidad = Math.min(Number(cantidad), maxStock);
      if (nextCantidad <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, cantidad: nextCantidad } : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: (action.payload.items || []).map((it) => ({
          ...it,
          // Normalizar cantidad desde versiones anteriores
          cantidad: Number(it.cantidad ?? it.quantity ?? 1),
          // Asegurar precio numérico y preferir oferta si existe
          precio: Number(it.precio ?? it.precio_oferta ?? it.price ?? 0)
        }))
      };
    
    default:
      return state;
  }
};

// Estado inicial del carrito
const initialState = {
  items: []
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Provider del contexto del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('ecostyle-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('ecostyle-cart', JSON.stringify(state));
  }, [state]);

  // Funciones para manejar el carrito
  const addItem = (producto) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { producto } });
  };

  const removeItem = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id } });
  };

  const updateQuantity = (id, cantidad) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, cantidad } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Calcular totales
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (Number(item.precio) * Number(item.cantidad ?? item.quantity ?? 1)), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + Number(item.cantidad ?? item.quantity ?? 1), 0);
  };

  const getItemQuantity = (id) => {
    const item = state.items.find(item => item.id === id);
    return item ? Number(item.cantidad ?? item.quantity ?? 0) : 0;
  };

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;