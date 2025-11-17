
import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

   const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
     const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return {success: true};
  } catch (error) {
    console.error('Registration error:', error);
    return {success: false, message: error.message};
  }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;