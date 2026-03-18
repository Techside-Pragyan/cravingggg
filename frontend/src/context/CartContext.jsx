import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (foodItemId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      setLoading(true);
      const { data } = await api.addToCart({ foodItemId, quantity });
      setCart(data);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      if (error.response?.data?.differentRestaurant) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add item');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (foodItemId, quantity) => {
    try {
      setLoading(true);
      const { data } = await api.updateCartItem({ foodItemId, quantity });
      setCart(data);
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const clearAllItems = async () => {
    try {
      setLoading(true);
      await api.clearCart();
      setCart({ items: [], totalAmount: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      loading,
      addItem,
      updateQuantity,
      clearAllItems,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
