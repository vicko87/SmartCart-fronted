import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    // Obtener el carrito del backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCart(res.data.data || res.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            if (error.response?.status !== 401) {
                setCart(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Agregar producto al carrito
    const addToCart = async (productId, quantity = 1) => {
        try {
            console.log('🛒 Adding to cart:', { productId, quantity });
            
            const res = await api.post('/cart', {
                productId,
                quantity
            });

            console.log('✅ Cart updated:', res.data);
            
            // Actualizar el carrito local
            await fetchCart();
            
            return res.data;
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            console.error('❌ Error response:', error.response?.data);
            throw error;
        }
    };

    // Actualizar cantidad
    const updateCartItem = async (productId, quantity) => {
        try {
            const res = await api.put('/cart', {
                productId,
                quantity
            });
            await fetchCart();
            return res.data;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    };

    // Eliminar del carrito
    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/cart/${productId}`);
            await fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    // Vaciar carrito
    const clearCart = async () => {
        try {
            await api.delete('/cart');
            await fetchCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    // Cargar carrito al montar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCart();
        }
    }, []);

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;