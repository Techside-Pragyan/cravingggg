import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { HiPlus, HiMinus, HiTrash, HiArrowLeft } from 'react-icons/hi';
import { MdDeliveryDining } from 'react-icons/md';

const Cart = () => {
  const { cart, cartCount, loading, updateQuantity, clearAllItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-in">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-text-muted mb-6">Please login to view your cart</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (loading) return <Loader />;

  if (!cart?.items?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text-muted mb-6">Add some delicious items from our restaurants!</p>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  const deliveryFee = cart.restaurant?.deliveryFee || 40;
  const subtotal = cart.totalAmount;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <HiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Your Cart</h1>
          <p className="text-text-muted text-sm">{cartCount} items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Restaurant info */}
          {cart.restaurant && (
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <img
                src={cart.restaurant.image}
                alt={cart.restaurant.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{cart.restaurant.name}</h3>
                <p className="text-text-muted text-xs flex items-center gap-1">
                  <MdDeliveryDining /> {cart.restaurant.deliveryTime}
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 border-b last:border-0 border-gray-100">
                <img
                  src={item.foodItem?.image}
                  alt={item.foodItem?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.foodItem?.name}</h4>
                  <p className="text-primary font-bold text-sm">₹{item.price}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-0 bg-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.foodItem?._id, item.quantity - 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors"
                  >
                    <HiMinus className="text-sm" />
                  </button>
                  <span className="px-3 py-1.5 font-bold text-sm min-w-[32px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.foodItem?._id, item.quantity + 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors"
                  >
                    <HiPlus className="text-sm" />
                  </button>
                </div>

                <span className="font-bold text-sm w-16 text-right">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={clearAllItems}
            className="flex items-center gap-2 text-danger text-sm font-medium
              hover:text-red-700 transition-colors"
          >
            <HiTrash /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Taxes (5%)</span>
                <span className="font-medium">₹{taxes}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full mt-6 text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
