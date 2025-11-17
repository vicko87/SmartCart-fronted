import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);

    // Obtener stock del producto
    const stockAmount = product.quantity || product.stock || 0;
    const isOutOfStock = stockAmount <= 0;

    // Función para obtener emoji según categoría
    const getCategoryEmoji = (category) => {
        const emojis = {
            'Frutas': '🍎',
            'Verduras': '🥬',
            'Lácteos': '🥛',
            'Panadería': '🍞',
            'Carnes': '🍗',
            'Pescados': '🐟',
            'Electronics': '💻',
            'Bebidas': '🥤',
            'Snacks': '🍪',
            'Congelados': '🧊'
        };
        return emojis[category] || '🛒';
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
            navigate('/login');
            return;
        }

        if (isOutOfStock) {
            alert('❌ Producto agotado');
            return;
        }

        try {
            setAdding(true);
            console.log('🛒 Adding to cart:', product._id);
            await addToCart(product._id, 1);
            alert(`✅ ${product.name} agregado al carrito`);
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            alert('❌ Error al agregar al carrito. Intenta de nuevo.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Badge de estado */}
            <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                    {isOutOfStock ? (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Agotado
                        </span>
                    ) : stockAmount < 10 ? (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Últimas unidades
                        </span>
                    ) : (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            FRESCO
                        </span>
                    )}
                </div>
                
                {/* Imagen del producto */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-8xl">
                            {getCategoryEmoji(product.category)}
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                {/* Categoría */}
                <div className="flex items-center mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        {getCategoryEmoji(product.category)} {product.category}
                    </span>
                </div>

                {/* Nombre */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {product.description}
                </p>

                {/* Stock y entrega */}
                <div className="flex items-center justify-between mb-3 text-xs">
                    <span className={`font-semibold ${stockAmount > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                        📦 {stockAmount} disponibles
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                        ⚡ Entrega hoy
                    </span>
                </div>

                {/* Precio y botón */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        {product.price > 10 && (
                            <span className="text-xs text-gray-400 line-through">
                                € {(product.price * 1.2).toFixed(2)}
                            </span>
                        )}
                        <span className="text-2xl font-bold text-green-600">
                            € {product.price.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all transform active:scale-95 ${
                            isOutOfStock
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : adding
                                ? 'bg-gray-400 text-white cursor-wait'
                                : 'bg-gradient-to-r from-green-600 to-orange-600 text-white hover:from-green-700 hover:to-orange-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        {adding ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Agregando...
                            </span>
                        ) : isOutOfStock ? (
                            '❌ Agotado'
                        ) : (
                            '🛒 Agregar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;