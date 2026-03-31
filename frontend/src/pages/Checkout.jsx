import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiCash, HiCreditCard } from 'react-icons/hi';
import Loader from '../components/Loader';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-in">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  const deliveryFee = cart.restaurant?.deliveryFee || 40;
  const subtotal = cart.totalAmount;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.zipCode) {
      toast.error('Please fill in your delivery address');
      return;
    }

    if (paymentMethod === 'online') {
      setShowPaymentGateway(true);
      setPaymentStatus('processing');
      // Simulate Razorpay Gateway Delay
      setTimeout(() => {
        setPaymentStatus('success');
        setTimeout(() => {
          submitOrder();
        }, 1500);
      }, 2500);
      return;
    }

    submitOrder();
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      setShowPaymentGateway(false);
      await api.placeOrder({
        deliveryAddress: address,
        paymentMethod,
      });

      toast.success('Order placed successfully! 🎉');
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <HiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-extrabold text-text-primary">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">📍 Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Street Address*</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="123 Main Street, Apt 4B"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">City*</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">State</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Maharashtra"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">ZIP Code*</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="400001"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">💳 Payment Method</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary w-4 h-4"
                  />
                  <HiCash className="text-2xl text-green-600" />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-text-muted text-xs">Pay when your order arrives</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'online'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="accent-primary w-4 h-4"
                  />
                  <HiCreditCard className="text-2xl text-blue-600" />
                  <div>
                    <p className="font-semibold">Online Payment</p>
                    <p className="text-text-muted text-xs">UPI, Credit/Debit Cards, Wallets</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-text-secondary truncate flex-1 mr-2">
                      {item.foodItem?.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Taxes (5%)</span>
                  <span>₹{taxes}</span>
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Place Order — ₹{grandTotal}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Payment Gateway Modal Overlay */}
      {showPaymentGateway && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl scale-in relative overflow-hidden">
            {/* Header stripe imitating razorpay */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-primary"></div>
            
            <div className="mb-6 flex justify-center">
              {paymentStatus === 'processing' ? (
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <HiCreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-blue-600 animate-pulse" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center scale-in">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">
              {paymentStatus === 'processing' ? 'Processing Payment...' : 'Payment Successful!'}
            </h3>
            
            <p className="text-sm text-text-muted mb-6">
              {paymentStatus === 'processing' 
                ? 'Please wait while we verify your transaction securely. Do not close this window.' 
                : 'Your transaction was verified securely. Redirecting you to orders...'}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm font-medium border border-gray-100">
              <span className="text-text-secondary">Amount Paying</span>
              <span className="text-lg text-primary">₹{grandTotal}</span>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure 256-bit Encrypted SSL
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
