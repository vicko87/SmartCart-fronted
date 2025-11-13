import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import AuthContext from "../context/AuthContext";





 const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {user} = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => { 
            try { setLoading(true);
        const res = await api.get('/orders');
            //Adaptar segun respuesta del backend
            setOrders(res.data.data || res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
        };
        if (user) {
        fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen"> 
            <div className="text-xl text-gray-600">Cargando pedidos...</div> 
            </div>

        )
        }

        if (!user) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen"> <div className="text-center"> 
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                     Inicia sesión para ver tus pedidos </h2>
                      <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" >
                       Ir a Login </Link>
                 </div> 
                 </div>
            )
        }

        if (error) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                 <div className="text-xl text-red-600">{error}
                </div>
                 </div> 
                ); }

   return ( 
   <div className="max-w-7xl mx-auto px-4 py-8"> 
   <div className="mb-8"> 
    <h1 className="text-3xl font-bold text-gray-900"> 📦 Mis Pedidos </h1>
     <p className="text-gray-600 mt-2"> Historial de tus compras </p> 
     </div>
  {orders.length === 0 ? ( 
    <div className="bg-white rounded-lg shadow-md p-12 text-center"> 
    <div className="text-6xl mb-4">🛒</div>
     <h2 className="text-2xl font-semibold text-gray-900 mb-2"> No tienes pedidos aún </h2> 
     <p className="text-gray-600 mb-6"> Empieza a comprar y tus pedidos aparecerán aquí </p> 
     <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" > Ver Productos </Link> 
     </div> ) :
      ( <div className="space-y-6"> {orders.map(order => ( <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" > {/* Header del pedido */}
       <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
         <div className="flex flex-wrap justify-between items-center gap-4">
             <div> <p className="text-sm text-gray-600"> Pedido realizado </p>
              <p className="font-semibold text-gray-900">
                 {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                 </p> 
                 </div> 
                 <div> <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-green-600"> 
                    ${parseFloat(order.total).toFixed(2)} </p> 
                    </div>
                     <div> <p className="text-sm text-gray-600">Estado</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                      ${ order.status === 'completed' ? 'bg-green-100 text-green-800' :
                         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                           'bg-red-100 text-red-800' }`}> {order.status === 'completed' && '✅ Completado'} 
                           {order.status === 'pending' && '⏳ Pendiente'} {order.status === 'processing' && '🔄 Procesando'} 
                           {order.status === 'cancelled' && '❌ Cancelado'} </span>
                            </div>
                             <div className="text-sm text-gray-600">
                                 <p>Pedido #{order._id.slice(-8).toUpperCase()}</p>
                                  </div> 
                                  </div> 
                                  </div> {/* Productos del pedido */}
                                   <div className="px-6 py-4"> <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                     Productos ({order.products?.length || 0}) </h3> <div className="space-y-4"> {order.products?.map((item, index) => ( <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0" > {/* Imagen del producto */} <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center"> {item.product?.image ? ( <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-md" /> ) : ( <span className="text-2xl">📦</span> )} </div> {/* Info del producto */} <div className="flex-grow"> <h4 className="font-semibold text-gray-900"> {item.product?.name || 'Producto'} </h4> <p className="text-sm text-gray-600"> Cantidad: {item.quantity} </p> </div> {/* Precio */} <div className="text-right"> <p className="text-sm text-gray-600">Precio unitario</p> <p className="font-semibold text-gray-900"> ${parseFloat(item.price).toFixed(2)} </p> <p className="text-sm text-gray-600 mt-1"> Subtotal: ${(item.price * item.quantity).toFixed(2)} </p> 
                                     </div> 
                                     </div> 
                                     ))}
                                     </div>
                                      </div> 
                                      </div>
                                       ))}
                                        </div>
                                         )}
                                          </div>
  );
};

export default Orders;
