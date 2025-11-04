import api from '../api/axiosConfig';
import { useEffect, useState } from 'react';



function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res =>
                setProducts(res.data));
            }, []);

            const addToCart = async (id) => {
            await api.post('/cart/add', { productId: id });
            alert ('Product added to cart!');
        };


  return (
    <div>
        <div className="p-4"></div>
        <h1 className="text-2xl font-semibold mb-4 text-primary">Products</h1>
         <div className="grid gap-4">
        {products.map(p => (

            <div key={p._id} className="p-4 bg-white shadow rounded-xl">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-gray-600">${p.price}</p>
                <button onClick={() => addToCart(p._id)} className="mt-2 bg-primary text-white px-4 py-2 rounded-lg">
                    Add to Cart
                </button>
            </div>
        ))}
    </div>
     </div>
  )
}

export default Products;