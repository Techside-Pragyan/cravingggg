import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch, HiMenu, HiX } from 'react-icons/hi';
import { MdDeliveryDining } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center
              group-hover:scale-110 transition-transform duration-300">
              <MdDeliveryDining className="text-white text-2xl" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-primary">Craving</span>
              <span className="text-secondary">ggg</span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                type="text"
                placeholder="Search restaurants or food..."
                className="input-field pl-10 py-2.5 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/restaurants?search=${e.target.value.trim()}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="btn-ghost text-sm">
                Admin Panel
              </Link>
            )}

            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <HiOutlineShoppingCart className="text-2xl text-text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs
                  rounded-full flex items-center justify-center font-bold scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 scale-in">
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-5">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white slide-up">
          <div className="p-4 space-y-3">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="input-field pl-10 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/restaurants?search=${e.target.value.trim()}`);
                    setMenuOpen(false);
                  }
                }}
              />
            </div>

            <Link to="/restaurants" className="block py-2 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              Restaurants
            </Link>
            <Link to="/cart" className="block py-2 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="block py-2 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg text-danger hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary w-full text-sm">Login</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
