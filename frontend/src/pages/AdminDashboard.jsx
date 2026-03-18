import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import {
  HiOutlineCollection, HiOutlineShoppingBag, HiOutlineUsers,
  HiOutlinePlusCircle, HiPencil, HiTrash, HiX
} from 'react-icons/hi';
import { MdRestaurant } from 'react-icons/md';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'restaurants') {
        const { data } = await api.getRestaurants({});
        setRestaurants(data);
      } else if (activeTab === 'food') {
        const { data } = await api.getFoodItems({});
        setFoodItems(data);
      } else if (activeTab === 'orders') {
        const { data } = await api.getAllOrders({});
        setOrders(data);
      } else if (activeTab === 'users') {
        const { data } = await api.getAllUsers();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!confirm('Delete this restaurant?')) return;
    try {
      await api.deleteRestaurant(id);
      toast.success('Restaurant deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await api.deleteFoodItem(id);
      toast.success('Food item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: status });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditData(null);
    setShowModal(true);
  };

  const tabs = [
    { id: 'restaurants', label: 'Restaurants', icon: <MdRestaurant /> },
    { id: 'food', label: 'Food Items', icon: <HiOutlineCollection /> },
    { id: 'orders', label: 'Orders', icon: <HiOutlineShoppingBag /> },
    { id: 'users', label: 'Users', icon: <HiOutlineUsers /> },
  ];

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-muted text-sm">Manage your food delivery platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Restaurants', value: restaurants.length || '...', color: 'bg-blue-500', icon: <MdRestaurant className="text-xl" /> },
          { label: 'Food Items', value: foodItems.length || '...', color: 'bg-green-500', icon: <HiOutlineCollection className="text-xl" /> },
          { label: 'Orders', value: orders.length || '...', color: 'bg-purple-500', icon: <HiOutlineShoppingBag className="text-xl" /> },
          { label: 'Users', value: users.length || '...', color: 'bg-amber-500', icon: <HiOutlineUsers className="text-xl" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`${stat.color} text-white w-10 h-10 rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Restaurants Tab */}
          {activeTab === 'restaurants' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">All Restaurants ({restaurants.length})</h2>
                <button onClick={() => openAddModal('restaurant')} className="btn-primary text-sm py-2 flex items-center gap-1">
                  <HiOutlinePlusCircle /> Add Restaurant
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-text-secondary">
                      <tr>
                        <th className="text-left p-3">Restaurant</th>
                        <th className="text-left p-3">Cuisine</th>
                        <th className="text-center p-3">Rating</th>
                        <th className="text-center p-3">Status</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {restaurants.map((r) => (
                        <tr key={r._id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-medium">{r.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-text-muted">{r.cuisine?.join(', ')}</td>
                          <td className="p-3 text-center font-bold">{r.rating?.toFixed(1)}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {r.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteRestaurant(r._id)} className="text-danger hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                              <HiTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Food Items Tab */}
          {activeTab === 'food' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">All Food Items ({foodItems.length})</h2>
                <button onClick={() => openAddModal('food')} className="btn-primary text-sm py-2 flex items-center gap-1">
                  <HiOutlinePlusCircle /> Add Food Item
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-text-secondary">
                      <tr>
                        <th className="text-left p-3">Item</th>
                        <th className="text-left p-3">Restaurant</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-center p-3">Price</th>
                        <th className="text-center p-3">Type</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {foodItems.map((f) => (
                        <tr key={f._id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={f.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-medium">{f.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-text-muted">{f.restaurant?.name || '—'}</td>
                          <td className="p-3 capitalize text-text-muted">{f.category?.replace('-', ' ')}</td>
                          <td className="p-3 text-center font-bold">₹{f.price}</td>
                          <td className="p-3 text-center">
                            <span className={f.isVeg ? 'badge-veg' : 'badge-nonveg'}>
                              {f.isVeg ? 'Veg' : 'Non-Veg'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteFood(f._id)} className="text-danger hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                              <HiTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-bold text-lg mb-4">All Orders ({orders.length})</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{order.user?.name || 'User'}</p>
                        <p className="text-text-muted text-xs">{order.user?.email}</p>
                        <p className="text-text-muted text-xs mt-1">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">₹{order.grandTotal}</p>
                        <p className="text-text-muted text-xs">{order.restaurant?.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-text-muted">Status:</span>
                      {['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateOrderStatus(order._id, status)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all
                            ${order.orderStatus === status
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                            }`}
                        >
                          {status.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="font-bold text-lg mb-4">All Users ({users.length})</h2>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-text-secondary">
                      <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-center p-3">Role</th>
                        <th className="text-left p-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="p-3 font-medium">{u.name}</td>
                          <td className="p-3 text-text-muted">{u.email}</td>
                          <td className="p-3 text-text-muted">{u.phone || '—'}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3 text-text-muted text-xs">
                            {new Date(u.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <AdminModal
          type={modalType}
          restaurants={restaurants}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
};

const AdminModal = ({ type, restaurants, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    type === 'restaurant'
      ? { name: '', description: '', cuisine: '', image: '', rating: 4.0, deliveryTime: '30-40 min', deliveryFee: 40, isVeg: false, featured: false }
      : { name: '', description: '', price: '', image: '', category: 'main-course', restaurant: '', isVeg: false, isBestseller: false }
  );

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'restaurant') {
        await api.createRestaurant({
          ...formData,
          cuisine: formData.cuisine.split(',').map((c) => c.trim()),
          rating: Number(formData.rating),
          deliveryFee: Number(formData.deliveryFee),
        });
        toast.success('Restaurant created!');
      } else {
        await api.createFoodItem({
          ...formData,
          price: Number(formData.price),
        });
        toast.success('Food item created!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">
            Add New {type === 'restaurant' ? 'Restaurant' : 'Food Item'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Name*</label>
            <input name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Description</label>
            <textarea name="description" className="input-field" rows={2} value={formData.description} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Image URL</label>
            <input name="image" className="input-field" value={formData.image} onChange={handleChange} placeholder="https://..." />
          </div>

          {type === 'restaurant' ? (
            <>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Cuisine (comma separated)*</label>
                <input name="cuisine" className="input-field" value={formData.cuisine} onChange={handleChange} placeholder="Indian, Chinese" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" className="input-field" value={formData.rating} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Delivery Fee</label>
                  <input name="deliveryFee" type="number" className="input-field" value={formData.deliveryFee} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} className="accent-green-600" />
                  Pure Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="accent-primary" />
                  Featured
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Restaurant*</label>
                <select name="restaurant" className="input-field" value={formData.restaurant} onChange={handleChange} required>
                  <option value="">Select restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Price*</label>
                  <input name="price" type="number" className="input-field" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Category*</label>
                  <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                    {['veg', 'non-veg', 'fast-food', 'desserts', 'beverages', 'starters', 'main-course', 'biryani', 'pizza', 'burger', 'chinese', 'south-indian'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} className="accent-green-600" />
                  Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isBestseller" checked={formData.isBestseller} onChange={handleChange} className="accent-amber-500" />
                  Bestseller
                </label>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              `Create ${type === 'restaurant' ? 'Restaurant' : 'Food Item'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
