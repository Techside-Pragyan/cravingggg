import { HiStar, HiPlus, HiMinus } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const FoodItemCard = ({ item }) => {
  const { cart, addItem, updateQuantity } = useCart();

  const cartItem = cart?.items?.find(
    (ci) => ci.foodItem?._id === item._id || ci.foodItem === item._id
  );
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item._id);
  };

  const handleIncrease = () => {
    updateQuantity(item._id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item._id, quantity - 1);
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {item.isVeg ? (
            <span className="badge-veg">
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-green-600 inline-block" />
              Veg
            </span>
          ) : (
            <span className="badge-nonveg">
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-red-600 inline-block" style={{ 
                background: 'linear-gradient(135deg, transparent 40%, #dc2626 40%)' 
              }} />
              Non-Veg
            </span>
          )}
          {item.isBestseller && (
            <span className="badge-bestseller">★ Bestseller</span>
          )}
        </div>

        <h4 className="font-semibold text-text-primary">{item.name}</h4>
        <p className="text-primary font-bold mt-1">₹{item.price}</p>

        {item.rating && (
          <div className="flex items-center gap-1 mt-1 text-sm text-text-muted">
            <HiStar className="text-amber-500" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        )}

        {item.description && (
          <p className="text-text-muted text-sm mt-2 line-clamp-2">{item.description}</p>
        )}
      </div>

      {/* Image + Add button */}
      <div className="relative shrink-0">
        <div className="w-28 h-24 rounded-xl overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            }}
          />
        </div>

        {/* Add / Quantity controls */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-white text-primary border-2 border-primary px-5 py-1.5 rounded-lg
                text-sm font-bold hover:bg-primary hover:text-white transition-all duration-200
                shadow-md active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-0 bg-primary text-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-2.5 py-1.5 hover:bg-primary-dark transition-colors"
              >
                <HiMinus className="text-sm" />
              </button>
              <span className="px-3 py-1.5 font-bold text-sm min-w-[32px] text-center bg-primary-dark/30">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-2.5 py-1.5 hover:bg-primary-dark transition-colors"
              >
                <HiPlus className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
