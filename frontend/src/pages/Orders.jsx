import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import Loader from '../components/Loader';
import { HiClock, HiCheck, HiX } from 'react-icons/hi';
import { MdDeliveryDining } from 'react-icons/md';

const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  preparing: 'bg-amber-100 text-amber-700',
  'out-for-delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  placed: <HiClock />,
  confirmed: <HiCheck />,
  preparing: '🍳',
  'out-for-delivery': <MdDeliveryDining />,
  delivered: <HiCheck />,
  cancelled: <HiX />,
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-in">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <h1 className="text-2xl font-extrabold text-text-primary mb-2">My Orders</h1>
      <p className="text-text-muted mb-8">Track and review your past orders</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-text-muted mb-6">Your order history will appear here</p>
          <Link to="/restaurants" className="btn-primary">Start Ordering</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order header */}
              <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {order.restaurant?.image && (
                    <img
                      src={order.restaurant.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{order.restaurant?.name}</h3>
                    <p className="text-text-muted text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[order.orderStatus]}`}>
                  {statusIcons[order.orderStatus]}
                  {order.orderStatus.replace('-', ' ')}
                </span>
              </div>

              {/* Order items */}
              <div className="p-4">
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {item.name || 'Item'} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-3" />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-muted">
                    <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    {' • '}
                    <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">₹{order.grandTotal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
