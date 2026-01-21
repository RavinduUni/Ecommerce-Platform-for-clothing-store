import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { createContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const [authLoading, setAuthLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const userDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/profile`);
      setUser(data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching user details");
    }
  }

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/products/all`);
      setAllProducts(data.products);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching products");
    }
  }

  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/cart`);
      setCart(data.cart.items);
    } catch (error) {
      alert("Error fetching cart");
    }
  }

  const removeFromCart = async (productId, size) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/remove-from-cart`, { productId, size });
      setCart(data.cart.items);
    } catch (error) {
      alert(error.response?.data?.message || "Error removing item from cart");
    }
  }

  const updateCartQuantity = async (productId, size, quantity) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/update-cart`, { productId, size, quantity });
      setCart(data.cart.items);
    } catch (error) {
      alert(error.response?.data?.message || "Error updating cart quantity");
    }
  }

  const fetchOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }
    setOrders([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/orders`);
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  }

  const createOrder = async (orderData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/orders`, orderData);
      await fetchOrders();
      await fetchCart();
      return data.order;
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setRole(null);
    setCart([]);
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!token) {
      logout();
      setAuthLoading(false);
      return;
    }

    let logoutTimer;

    try {
      const decoded = jwtDecode(token);

      const expiryTime = decoded.exp * 1000;
      const now = Date.now();

      if (expiryTime < now) {
        logout();
        setAuthLoading(false);
        return;
      }

      setRole(decoded.role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      fetchCart();
      userDetails();

      const remainingTime = expiryTime - now;
      logoutTimer = setTimeout(() => {
        logout();
      }, remainingTime);

    } catch (error) {
      logout();
      setCart([]);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setAuthLoading(false);
    }

    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    }

  }, [token]);


  const value = {
    backendUrl,
    authLoading,
    token,
    setToken,
    role,
    allProducts,
    fetchProducts,
    cart,
    setCart,
    fetchCart,
    removeFromCart,
    orders,
    fetchOrders,
    createOrder,
    updateCartQuantity,
    logout,
    user
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;