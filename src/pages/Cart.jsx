import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Cart = () => {
  const { cart, fetchCart, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      alert('No se pudo actualizar la cantidad del producto.');
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Error removing cart item:', error);
        alert('No se pudo eliminar el producto del carrito.');
      }
    }
  };

  const handleCheckout = () => {
    // Lógica de pago aquí
    alert('Funcionalidad de pago no implementada aún.');
  };
  if (loading) {
    return (<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4">
        </div> <p className="text-xl text-gray-600">Cargando carrito...</p>
      </div> </div>
    );
  }

  const cartItems = cart?.products || [];
  const total = cartItems.reduce((sum, item) => sum +
    (item.product?.price || 0) * item.quantity, 0);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */} <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛒 Mi Carrito
        </h1>
        <p className="text-gray-600">
          {cartItems.length} {cartItems.length === 1 ?
            'producto' : 'productos'} en tu carrito </p>
      </div>

      {cartItems.length === 0 ? (
        // Carrito vacío 
        <div className="text-center py-20">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío </h2> <p className="text-gray-600 mb-8">
            Agrega productos para empezar tu compra
          </p>
          <Link to="/" className="inline-block bg-gradient-to-r from-green-600 
       to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 
       hover:to-orange-700 transition-all" >
            Ver Productos </Link>
        </div>
      ) : (
        // Carrito con productos
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (<div key={item.product?._id}
              className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4" >
              {/* Imagen del producto */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 
  to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.product?.image ? (<img src={item.product.image} alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg" />
                ) : (<span className="text-4xl">🥗</span>)}
              </div>
              {/* Información del producto */}
              <div className="flex-1"> <h3 className="text-lg font-bold text-gray-900">
                {item.product?.name} </h3> <p className="text-sm text-gray-600 mt-1">
                  {item.product?.description} </p>
                <p className="text-xl font-bold text-green-600 mt-2">
                  € {(item.product?.price || 0).toFixed(2)}
                </p>
              </div>
              {/* Controles de cantidad */}
              <div className="flex items-center space-x-3">
                <button onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold" >
                  - </button>
                <span className="text-lg font-semibold w-8 text-center"> {item.quantity}
                </span>
                <button onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center font-bold" >
                  + </button>
              </div>
              {/* Subtotal y eliminar */}
              <div className="text-right"> <p className="text-lg font-bold text-gray-900">
                € {((item.product?.price || 0) * item.quantity).toFixed(2)} </p>
                <button onClick={() => handleRemove(item.product?._id)} className="text-red-500 hover:text-red-700 text-sm mt-2" >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
            ))}
            {/* Botón limpiar carrito */}
            {cartItems.length > 0 && (<button onClick={() => {
              if (window.confirm('¿Vaciar todo el carrito?')) { clearCart(); }
            }} className="text-red-500 hover:text-red-700 font-medium" >
              🗑️ Vaciar carrito </button>
            )}
          </div>
          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6"> Resumen del Pedido </h2>
              <div className="space-y-3 mb-6"> <div className="flex justify-between text-gray-600">
                <span>Subtotal</span> <span>€ {total.toFixed(2)}</span> </div> <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>€ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-green-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-orange-700 transition-all mb-4" > Proceder al Pago </button> <Link to="/" className="block text-center text-green-600 hover:text-green-700 font-medium" >
                ← Seguir Comprando
              </Link>
              {/* Beneficios */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center text-sm text-gray-600"> <span className="mr-2">✅</span> <span>Envío gratis en todos los pedidos</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🔒</span> <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🚚</span> <span>Entrega en el día</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 