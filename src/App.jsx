import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './pages/Products'
//import Login from './pages/Login'
//import Register from './pages/Register'
import Cart from './pages/Cart'
//import Orders from './pages/Orders'
import { AuthProvider } from './context/AuthContext'



function App() {
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
            {/* Comentar las rutas que no tienes aún */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<Orders />} /> */}
     
      </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  )
}
export default App


