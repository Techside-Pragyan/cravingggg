import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Loader';
import * as api from '../api';
import { HiArrowRight, HiSearch } from 'react-icons/hi';
import { MdDeliveryDining, MdRestaurant, MdLocalOffer, MdStar } from 'react-icons/md';

const categories = [
  { name: 'Pizza', emoji: '🍕', filter: 'pizza' },
  { name: 'Burgers', emoji: '🍔', filter: 'burger' },
  { name: 'Biryani', emoji: '🍚', filter: 'biryani' },
  { name: 'Chinese', emoji: '🥡', filter: 'chinese' },
  { name: 'Desserts', emoji: '🍰', filter: 'desserts' },
  { name: 'South Indian', emoji: '🥘', filter: 'south-indian' },
  { name: 'Fast Food', emoji: '🌮', filter: 'fast-food' },
  { name: 'Beverages', emoji: '🥤', filter: 'beverages' },
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.getFeaturedRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
        // Fallback: try getting all
        try {
          const { data } = await api.getRestaurants({});
          setRestaurants(data.slice(0, 8));
        } catch  {
          console.error('Failed to fetch restaurants');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white
                px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MdDeliveryDining className="text-lg" />
                Delivering in 30 mins
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                Your favorite food,
                <br />
                <span className="text-yellow-200">delivered fast.</span>
              </h1>

              <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
                Discover the best restaurants near you. Order your cravings with just a few taps.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/restaurants" className="inline-flex items-center justify-center gap-2
                  bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg
                  hover:bg-yellow-50 transition-all duration-300 hover:shadow-xl
                  active:scale-95">
                  <HiSearch className="text-xl" />
                  Explore Restaurants
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,106.7C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <MdRestaurant className="text-3xl text-primary" />, label: 'Restaurants', value: '500+' },
            { icon: <MdDeliveryDining className="text-3xl text-primary" />, label: 'Deliveries', value: '10K+' },
            { icon: <MdStar className="text-3xl text-primary" />, label: 'Happy Users', value: '50K+' },
            { icon: <MdLocalOffer className="text-3xl text-primary" />, label: 'Offers', value: '100+' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-text-primary">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">
          What are you craving?
        </h2>
        <p className="text-text-muted mb-8">Explore by category</p>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.filter}
              to={`/restaurants?category=${cat.filter}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100
                hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform duration-300">
                {cat.emoji}
              </span>
              <span className="text-xs font-medium text-text-secondary group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
              Featured Restaurants
            </h2>
            <p className="text-text-muted mt-1">Handpicked just for you</p>
          </div>
          <Link
            to="/restaurants"
            className="hidden md:flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
          >
            View All <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">
            View All Restaurants <HiArrowRight />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="gradient-hero rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Hungry? We've got you covered 🍕
          </h2>
          <p className="text-white/80 text-lg mb-6 max-w-lg mx-auto">
            Order from the best restaurants in your city. Fast delivery, great prices.
          </p>
          <Link to="/restaurants" className="inline-flex items-center gap-2
            bg-white text-primary px-8 py-4 rounded-2xl font-bold
            hover:bg-yellow-50 transition-all hover:shadow-xl active:scale-95">
            Order Now <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
