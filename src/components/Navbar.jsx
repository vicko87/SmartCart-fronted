import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemsCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl">🛒</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                            SmartCart Market
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                            🥗 Productos
                        </Link>
                        
                        {user && (
                            <>
                                <Link to="/orders" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                                    📦 Mis Pedidos
                                </Link>
                                <Link to="/profile" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                                    👤 Perfil
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right side - Cart & User */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link 
                            to="/cart" 
                            className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700">
                                    Hola, <span className="font-semibold">{user.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;