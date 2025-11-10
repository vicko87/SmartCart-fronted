import { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import CartContext from '../context/CartContext';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products');
                // Adaptar según respuesta del backend
                setProducts(res.data.data || res.data);
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            alert('¡Producto agregado al carrito!');
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Error al agregar al carrito');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Cargando productos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                🛍️ Productos Disponibles
            </h1>
            
            {products.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">No hay productos disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div 
                            key={product._id} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Imagen del producto */}
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                {product.image ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl">📦</span>
                                )}
                            </div>
                            
                            {/* Información del producto */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {product.name}
                                </h3>
                                
                                {product.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}
                                
                                {/* Precio y Stock */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-green-600">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className={`text-sm px-2 py-1 rounded ${
                                        product.stock > 10 
                                            ? 'bg-green-100 text-green-800' 
                                            : product.stock > 0 
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                                    </span>
                                </div>
                                
                                {/* Botón agregar al carrito */}
                                <button
                                    onClick={() => handleAddToCart(product._id)}
                                    disabled={product.stock === 0}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {product.stock === 0 ? '❌ Sin stock' : '🛒 Agregar al carrito'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;