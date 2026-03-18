import { Link } from 'react-router-dom';
import { MdDeliveryDining } from 'react-icons/md';
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="gradient-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
                <MdDeliveryDining className="text-white text-2xl" />
              </div>
              <span className="text-xl font-extrabold">Cravingggg</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your favorite food, delivered fast. Discover the best restaurants near you.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center
                hover:bg-primary transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center
                hover:bg-primary transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center
                hover:bg-primary transition-colors">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/restaurants?cuisine=pizza" className="hover:text-primary transition-colors">Pizza</Link></li>
              <li><Link to="/restaurants?cuisine=burger" className="hover:text-primary transition-colors">Burgers</Link></li>
              <li><Link to="/restaurants?isVeg=true" className="hover:text-primary transition-colors">Vegetarian</Link></li>
              <li><Link to="/restaurants?cuisine=desserts" className="hover:text-primary transition-colors">Desserts</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@cravingggg.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Cravingggg. All rights reserved. Made with ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;
