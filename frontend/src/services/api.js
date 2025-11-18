import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error)
    
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response
      
      switch (status) {
        case 404:
          throw new Error(data.message || 'Recurso no encontrado')
        case 500:
          throw new Error(data.message || 'Error interno del servidor')
        default:
          throw new Error(data.message || 'Error en la solicitud')
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor')
    } else {
      // Algo pasó al configurar la solicitud
      throw new Error('Error al procesar la solicitud')
    }
  }
)

// Servicios de productos
export const productosAPI = {
  // Obtener todos los productos con filtros opcionales
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams()
    
    if (filtros.categoria) params.append('categoria', filtros.categoria)
    if (filtros.precio_min) params.append('precio_min', filtros.precio_min)
    if (filtros.precio_max) params.append('precio_max', filtros.precio_max)
    if (filtros.disponible !== undefined) params.append('disponible', filtros.disponible)
    if (filtros.buscar) params.append('buscar', filtros.buscar)
    if (filtros.orden) params.append('orden', filtros.orden)
    if (filtros.limite) params.append('limite', filtros.limite)
    
    const response = await api.get(`/productos?${params.toString()}`)
    return response.data
  },

  // Obtener producto por ID (con fallback de ruta)
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/productos?id=${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      const response = await api.get(`/api/productos.php?id=${id}`)
      return response.data
    }
  },

  // Obtener productos destacados
  obtenerDestacados: async (limite = 6) => {
    const response = await api.get(`/productos?destacado=1&limite=${limite}`)
    return response.data
  },

  // Buscar productos
  buscar: async (termino, filtros = {}) => {
    const response = await api.get('/buscar', {
      params: {
        q: termino,
        ...filtros
      }
    })
    return response.data
  }
}

// Servicios de categorías
export const categoriasAPI = {
  // Obtener todas las categorías
  obtenerTodas: async () => {
    const response = await api.get('/categorias')
    return response.data
  },

  // Obtener categoría por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },

  // Obtener categorías con conteo de productos
  obtenerConConteo: async () => {
    const response = await api.get('/categorias?conteo=1')
    return response.data
  }
}

// Servicios de contacto
export const contactoAPI = {
  // Enviar mensaje de contacto
  enviarMensaje: async (datos) => {
    const response = await api.post('/contacto', datos)
    return response.data
  }
}

// Servicios de órdenes
export const ordenesAPI = {
  crear: async (orden) => {
    try {
      const response = await api.post('/ordenes', orden)
      return response.data
    } catch (err) {
      const response = await api.post('/api/ordenes.php', orden)
      return response.data
    }
  },
  obtener: async () => {
    try {
      const response = await api.get('/ordenes')
      return response.data
    } catch (err) {
      const response = await api.get('/api/ordenes.php')
      return response.data
    }
  }
}

// Función helper para formatear precios
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP'
  }).format(precio)
}

// Función helper para formatear fechas
export const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(fecha))
}

// Mantener compatibilidad con funciones existentes
export const getProducts = (params = {}) => {
  return productosAPI.obtenerTodos(params)
}

export const obtenerProductoPorId = (id) => {
  return productosAPI.obtenerPorId(id)
}

export const createUser = (payload) => {
  return contactoAPI.enviarMensaje({
    nombre: payload.nombre,
    correo: payload.correo,
    mensaje: payload.mensaje
  })
}

export default api
