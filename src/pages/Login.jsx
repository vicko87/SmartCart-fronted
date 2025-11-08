import { useState, useContext} from "react";
import {Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";


 const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
    }

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate('/')
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
              console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);      
        }
    };
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                🛍️ SmartCart
            </h2>
            <h3 className="mt-2 text-center text-xl text-gray-600">
            Inicia sesión en tu cuenta
          </h3>
        </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
  {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
              </label>
                <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                      </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            </div>

            <div className="text-center">
                <span className="text-sm text-gray-600">
                 ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Regístrate aquí
              </Link>
                </span>
            </div>
               </form>
      </div>
    
   </div>
  )
}

export default Login;