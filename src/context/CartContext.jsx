import { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(false);

    //Obtener el carrito de backend
    const getCart = async () => {
        try {
            setLoadingCart(true);
            const res = await api.get("/cart");
            //si backend devuelve {success, data:cart} adaptar
            const data = res.data?.data ?? res.data;
            setCart(data);
        } catch (err)
{
    console.errorr('[Cart] getCart error:', err.response.data ?? err.message);
    setCart(null);
} finally {
    setLoadingCart(false);
}
    };

    //Agregar producto al carrito
    const addToCart = async (productId, quantity = 1) => {
        try {
                // Endpoint POST /api/cart/add
                const res = await api.post("/cart/add", { productId, quantity });
                const data = res.data?.data ?? res.data;
                //refrescar el carrito para mantener consistencia del servidor
                await getCart();
                return data;
        } catch (err) {
            console.error('[Cart] addToCart error:', err.response.data?.data ?? err.message);
            throw err;
        }
    };

    //Actualizar cantidad de un producto en el carrito
    const updateCartItem = async (productId, quantity) => {
        try {
            // Endpoint PUT /api/cart/update
            await api.put(`/cart/update/${productId}`, { quantity });
            await getCart();
        } catch (err) {
            console.error('[Cart] updateCartItem error:', err.response.data?.data ?? err.message);
            throw err;
        }
    };

    //Eliminar un producto del carrito
    const removeFormCart = async (productId) => {
        try {
            // Endpoint DELETE /api/cart/remove
            await api.delete(`/cart/remove/${productId}`);
            await getCart();
        } catch (err) {
            console.error('[Cart] removeFormCart error:', err.response.data?.data ?? err.message);
            throw err;
        }
    };

    //Vaciar el carrito
    const clearCart = async () => {
        try {
            // Endpoint DELETE /api/cart/clear
            await api.delete("/cart/clear");
            await getCart();
        } catch (err) {
            console.error('[Cart] clearCart error:', err.response.data?.data ?? err.message);
            throw err;  
        }
    };

    //crear orden checkout
    const createOrder = async () => {
        try {
            // Endpoint POST /api/orders
            const res = await api.post('/orders/create');
            const data = res.data?.data ?? res.data;
            //vaciar carrito despues de crear orden
            await clearCart();
            return data;
        } catch (err) {
            console.error('[Cart] createOrder error:', err.response.data?.data ?? err.message);
            throw err;
        }
    };

    useEffect(() => {
    //cargar carrito al montar (si hay token en localStorage)
    getCart();
}, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loadingCart,
                getCart,
                addToCart,
                updateQuantity,
                removeFormCart,
                clearCart,
                createOrder,    
            }}
        >
            {children}
        </CartContext.Provider>
    );
}





        