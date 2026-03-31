import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import Loader from '../components/Loader';
import * as api from '../api';
import { HiStar, HiClock, HiLocationMarker } from 'react-icons/hi';
import { MdDeliveryDining } from 'react-icons/md';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, foodRes] = await Promise.all([
          api.getRestaurant(id),
          api.getFoodByRestaurant(id),
        ]);
        setRestaurant(restRes.data);
        setFoodItems(foodRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-bold">Restaurant not found</h3>
      </div>
    );
  }

  const categories = ['all', ...new Set(foodItems.map((item) => item.category))];
  const filteredItems = activeCategory === 'all'
    ? foodItems
    : foodItems.filter((item) => item.category === activeCategory);

  return (
    <div className="fade-in">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x400?text=Restaurant';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {restaurant.isVeg && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold mb-3 inline-block">
                PURE VEG
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {restaurant.name}
            </h1>

            <p className="text-white/70 text-sm mb-3">
              {restaurant.cuisine?.join(' • ')}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-lg font-bold">
                <HiStar /> {restaurant.rating?.toFixed(1)}
                <span className="font-normal text-xs ml-1">
                  ({restaurant.totalRatings?.toLocaleString()}+ ratings)
                </span>
              </span>

              <span className="flex items-center gap-1">
                <HiClock className="text-primary-light" /> {restaurant.deliveryTime}
              </span>

              <span className="flex items-center gap-1">
                <MdDeliveryDining className="text-primary-light" /> ₹{restaurant.deliveryFee} delivery
              </span>

              {restaurant.address?.city && (
                <span className="flex items-center gap-1">
                  <HiLocationMarker className="text-primary-light" />
                  {restaurant.address.street}, {restaurant.address.city}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {restaurant.description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <p className="text-text-secondary">{restaurant.description}</p>
        </div>
      )}

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-extrabold text-text-primary mb-6">Menu</h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize
                ${activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
            >
              {cat === 'all' ? 'All Items' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Food items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-text-muted">No items found in this category</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <FoodItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
