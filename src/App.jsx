import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import './App.css'
import { AuthProvider } from './context/AuthContext'



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}



export default App
