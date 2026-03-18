import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getAllUsers = () => API.get('/auth/users');

// Restaurant APIs
export const getRestaurants = (params) => API.get('/restaurants', { params });
export const getFeaturedRestaurants = () => API.get('/restaurants/featured');
export const getRestaurant = (id) => API.get(`/restaurants/${id}`);
export const createRestaurant = (data) => API.post('/restaurants', data);
export const updateRestaurant = (id, data) => API.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => API.delete(`/restaurants/${id}`);

// Food APIs
export const getFoodItems = (params) => API.get('/food', { params });
export const getFoodByRestaurant = (id) => API.get(`/food/restaurant/${id}`);
export const getFoodItem = (id) => API.get(`/food/${id}`);
export const createFoodItem = (data) => API.post('/food', data);
export const updateFoodItem = (id, data) => API.put(`/food/${id}`, data);
export const deleteFoodItem = (id) => API.delete(`/food/${id}`);

// Cart APIs
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart/add', data);
export const updateCartItem = (data) => API.put('/cart/update', data);
export const clearCart = () => API.delete('/cart/clear');

// Order APIs
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export default API;
