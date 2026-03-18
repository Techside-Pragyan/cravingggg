import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import Loader, { CardSkeleton } from '../components/Loader';
import * as api from '../api';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

const cuisineFilters = [
  'All', 'North Indian', 'South Indian', 'Chinese', 'Italian',
  'Fast Food', 'Desserts', 'American', 'Burgers', 'Pizza',
];

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isVeg, setIsVeg] = useState(false);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine, isVeg, sortBy]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) {
      setSearch(s);
      fetchRestaurants(s);
    }
  }, [searchParams]);

  const fetchRestaurants = async (searchQuery) => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery || search) params.search = searchQuery || search;
      if (selectedCuisine !== 'All') params.cuisine = selectedCuisine;
      if (isVeg) params.isVeg = 'true';
      if (sortBy) params.sort = sortBy;

      const { data } = await api.getRestaurants(params);
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCuisine('All');
    setIsVeg(false);
    setSortBy('');
    setSearchParams({});
  };

  const hasFilters = search || selectedCuisine !== 'All' || isVeg || sortBy;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary">All Restaurants</h1>
        <p className="text-text-muted mt-1">Discover the best food around you</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for restaurants, cuisines..."
            className="input-field pl-12 pr-24"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm">
            Search
          </button>
        </form>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          <HiFilter className="text-text-muted" />

          {/* Cuisine tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {cuisineFilters.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCuisine === cuisine
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          {/* Veg toggle */}
          <button
            onClick={() => setIsVeg(!isVeg)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all
              ${isVeg
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
          >
            <span className="w-3 h-3 rounded-sm border-2 border-current" />
            Pure Veg
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-white text-text-secondary
              focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sort by</option>
            <option value="rating">Rating</option>
            <option value="deliveryTime">Delivery Time</option>
            <option value="name">Name</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-danger
                bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <HiX className="text-xs" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No restaurants found</h3>
          <p className="text-text-muted mb-6">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
        </div>
      ) : (
        <>
          <p className="text-text-muted text-sm mb-4">{restaurants.length} restaurants found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantList;
