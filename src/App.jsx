import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Profile from './pages/Profile.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar'


// Componente para manejar el layout con lógica de mostrar/ocultar
function AppLayout() {
  const location = useLocation();
  
  // Ocultar Navbar y Footer en páginas de autenticación
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navbar - oculto en login/register */}
      {!hideLayout && <Navbar />}
      
      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App