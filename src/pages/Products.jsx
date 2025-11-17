import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log('🔍 Fetching products...');
                
                const res = await api.get('/products');
                console.log('✅ Full response:', res);
                console.log('✅ Response data:', res.data);
                
                // Extraer productos correctamente
                let productsData = [];
                if (res.data.data) {
                    productsData = res.data.data;
                } else if (Array.isArray(res.data)) {
                    productsData = res.data;
                } else if (res.data.products) {
                    productsData = res.data.products;
                }
                
                console.log('📦 Products extracted:', productsData);
                console.log('📦 Products count:', productsData.length);
                
                setProducts(productsData);
            } catch (err) {
                console.error('❌ Error loading products:', err);
                console.error('❌ Error response:', err.response);
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Cargando alimentos frescos...</p>
                </div>
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

    console.log('🎨 Rendering products. Count:', products.length);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    🛒 Alimentos Frescos
                </h1>
                <p className="text-gray-600">
                    Los mejores alimentos para tu hogar
                </p>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-8xl mb-4">🥬</div>
                    <p className="text-2xl text-gray-500 mb-4">No hay alimentos disponibles</p>
                    <p className="text-gray-400">Vuelve pronto para ver alimentos frescos</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;