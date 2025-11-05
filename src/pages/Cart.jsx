import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Cart = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
        
        {user ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p>Bienvenido, {user.name}! Tu carrito está vacío por ahora.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p>Inicia sesión para ver tu carrito.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 