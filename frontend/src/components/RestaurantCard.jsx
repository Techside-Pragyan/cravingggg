import { Link } from 'react-router-dom';
import { HiStar, HiClock } from 'react-icons/hi';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="card overflow-hidden group block">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Featured badge */}
        {restaurant.featured && (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold">
            Featured
          </div>
        )}

        {/* Delivery time */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-text-primary
          px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
          <HiClock className="text-primary" />
          {restaurant.deliveryTime}
        </div>

        {/* Veg badge */}
        {restaurant.isVeg && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
            PURE VEG
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-lg text-sm font-bold shrink-0">
            <HiStar className="text-xs" />
            {restaurant.rating?.toFixed(1)}
          </div>
        </div>

        <p className="text-text-secondary text-sm mt-1 line-clamp-1">
          {restaurant.cuisine?.join(', ')}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-text-muted text-xs">
            {restaurant.totalRatings?.toLocaleString()}+ ratings
          </span>
          <span className="text-text-muted text-xs">
            ₹{restaurant.deliveryFee} delivery
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
