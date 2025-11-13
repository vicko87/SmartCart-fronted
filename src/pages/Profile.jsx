import { useState, useContext, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axiosConfig";



 const Profile = () => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const {user, logout, updateUser} = useContext(AuthContext);
    const navigate = useNavigate();

    //Cargar datos del usuario
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }))
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
             ...formData,
             [e.target.name]: e.target.value
        });
        // Limpiar mensajes
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        //Validaciones básicas
        if (!formData.name || !formData.email) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }
        // Validar cambio de contraseña
        if(formData.newPassword) {
            if(!formData.currentPassword) {
                setError('Por favor ingresa tu contraseña actual para cambiar la contraseña');
                setLoading(false);
                return;
            }
            if(formData.newPassword !== formData.confirmPassword) {
                setError('Las nuevas contraseñas no coinciden');
                setLoading(false);
                return;
            }
            if(formData.newPassword.length < 6) {
                setError('La nueva contraseña debe tener al menos 6 caracteres');
                setLoading(false);
                return;
            }
        }
            
        try {
            const updatedData = {
                name: formData.name,
                email: formData.email
            };

            // Incluir cambio de contraseña si aplica
            if(formData.newPassword) {
                updatedData.currentPassword = formData.currentPassword;
                updatedData.newPassword = formData.newPassword;
            }

            const res = await api.put('/users/profile', updatedData);

            // Actualizar contexto de autenticación
            if(updateUser){
                updateUser(res.data.user || res.data);     
            }

            setSuccess('Perfil actualizado correctamente');
            setEditing(false);


            // Limpiar campos de contraseña
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Ocurrió un error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCancel = () => {
        setEditing(false);
        setError('');
        setSuccess('');
        // Restaurar datos originales
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }))
        }
    };

    if (!user) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Inicia sesión para ver tu perfil
                    </h2>
                    <Link 
                        to="/login" 
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Ir a Login
                    </Link>
                </div>
            </div>
        );
    }
return (
<div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    👤 Mi Perfil
                </h1>
                <p className="text-gray-600 mt-2">
                    Gestiona tu información personal
                </p>
            </div>

            {/* Mensajes */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    {success}
                </div>
            )}

            {/* Card principal */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Avatar y nombre */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12 text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                        <span className="text-6xl">
                            {user.name?.charAt(0).toUpperCase() || '👤'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {user.name}
                    </h2>
                    <p className="text-blue-100 mt-1">{user.email}</p>
                    <p className="text-sm text-blue-200 mt-2">
                        Miembro desde {new Date(user.createdAt || Date.now()).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Información básica */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Información personal
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre completo
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        disabled={!editing}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        disabled={!editing}
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cambiar contraseña (solo si está editando) */}
                        {editing && (
                            <div className="mb-6 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Cambiar contraseña (opcional)
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Contraseña actual
                                        </label>
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nueva contraseña
                                        </label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmar nueva contraseña
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-4 pt-6 border-t">
                            {!editing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                    >
                                        ✏️ Editar Perfil
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-medium transition-colors"
                                    >
                                        🚪 Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Guardando...' : '💾 Guardar Cambios'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ❌ Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Links adicionales */}
            <div className="mt-6 text-center space-x-4">
                <Link to="/orders" className="text-blue-600 hover:text-blue-800">
                    📦 Ver mis pedidos
                </Link>
                <Link to="/cart" className="text-blue-600 hover:text-blue-800">
                    🛒 Ver mi carrito
                </Link>
                <Link to="/" className="text-blue-600 hover:text-blue-800">
                    🛍️ Ver productos
                </Link>
            </div>
        </div>
    );
};

export default Profile;