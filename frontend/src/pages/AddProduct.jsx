import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/common.css'

const AddProduct = () => {
    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        precio_oferta: '',
        categoria_id: '',
        stock: '',
        imagen: '',
        destacado: false
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Usar la ruta amigable del router backend
                const response = await api.get('/categorias');
                setCategories(response.data.data);
            } catch (error) {
                console.error(error)
                try {
                    // Fallback directo al archivo PHP si no hay router
                    const response = await api.get('/api/categorias.php');
                    setCategories(response.data.data);
                } catch (err2) {
                    console.error("Error fetching categories:", err2);
                }
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // El endpoint nuevo está en /api
            // Preparar payload: convertir campos numéricos
            const payload = {
                ...product,
                precio: product.precio !== '' ? Number(product.precio) : '',
                precio_oferta:
                    product.precio_oferta !== '' ? Number(product.precio_oferta) : '',
                categoria_id:
                    product.categoria_id !== '' ? Number(product.categoria_id) : '',
                stock: product.stock !== '' ? Number(product.stock) : '',
            }

            const response = await api.post('/api/add_producto.php', payload);
            setMessage(response.data.message);
            if (response.status === 201) {
                setProduct({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    precio_oferta: '',
                    categoria_id: '',
                    stock: '',
                    imagen: '',
                    destacado: false
                });
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al crear el producto.");
        }
    };

    return (
        <div className="add-product-page">
            <div className="container" style={{ maxWidth: '860px', padding: '16px' }}>
                <div className="page-header">
                    <h1 className="page-title">Añadir Nuevo Producto</h1>
                    <p className="page-description">Completa los datos para crear un producto. El precio de oferta es opcional.</p>
                </div>

                {message && (
                    <div className="error-message" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
                        {message}
                    </div>
                )}

                <div className="form-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: 'var(--shadow)', padding: '20px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-field">
                                <label>Nombre</label>
                                <input type="text" name="nombre" value={product.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label>Categoría</label>
                                <select name="categoria_id" value={product.categoria_id} onChange={handleChange} required>
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                                <label>Descripción</label>
                                <textarea name="descripcion" value={product.descripcion} onChange={handleChange} rows="3" required></textarea>
                            </div>

                            <div className="form-field">
                                <label>Precio</label>
                                <input type="number" name="precio" value={product.precio} onChange={handleChange} step="0.01" min="0" required />
                            </div>
                            <div className="form-field">
                                <label>Precio de Oferta (opcional)</label>
                                <input type="number" name="precio_oferta" value={product.precio_oferta} onChange={handleChange} step="0.01" min="0" />
                            </div>

                            <div className="form-field">
                                <label>Stock</label>
                                <input type="number" name="stock" value={product.stock} onChange={handleChange} min="0" required />
                            </div>
                            <div className="form-field">
                                <label>URL de Imagen</label>
                                <input type="text" name="imagen" value={product.imagen} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" name="destacado" checked={product.destacado} onChange={handleChange} />
                                Producto destacado
                            </label>
                            <button type="submit" className="btn btn-primary">
                                Añadir Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;