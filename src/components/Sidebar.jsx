import {Link, useLocation} from 'react-router-dom';
import {useContext} from 'react';
import AuthContext from '../context/AuthContext';

export const Sidebar = () => {
    const {user} = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
      { path: '/', icon: '🏠', label: 'Inicio', public: true },
      { path: '/cart', icon: '🛒', label: 'Carrito', public: true },
      { path: '/orders', icon: '📦', label: 'Mis Pedidos', requiresAuth: true },
      { path: '/profile', icon: '👤', label: 'Mi Perfil', requiresAuth: true }
    ];

    const visibleItems = menuItems.filter(item => 
      item.public || (item.requiresAuth && user)
    );

  return (
 <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40">
            <div className="p-4">
                {/* User info */}
                {user && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs opacity-80">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu items */}
                <nav className="space-y-2">
                    {visibleItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                isActive(item.path)
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Categorías */}
                <div className="mt-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-4">
                        Categorías
                    </h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            💻 Laptops
                        </button>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            🖱️ Accesorios
                        </button>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            🖥️ Monitores
                        </button>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            ⌨️ Teclados
                        </button>
                    </div>
                </div>
            </div>
        </aside>

  )
}

export default Sidebar;