import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import { MdDeliveryDining } from 'react-icons/md';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await api.registerUser(formData);
        toast.success('Account created successfully! 🎉');
      } else {
        response = await api.loginUser({
          email: formData.email,
          password: formData.password,
        });
        toast.success('Welcome back! 👋');
      }
      login(response.data);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
              <MdDeliveryDining className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-text-muted mt-2">
            {isSignup ? 'Sign up to start ordering' : 'Login to your account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="input-field"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isSignup ? 'Create Account' : 'Login'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          {!isSignup && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <p className="font-semibold text-amber-700 mb-1">Demo Credentials:</p>
              <p className="text-amber-600">User: john@example.com / password123</p>
              <p className="text-amber-600">Admin: admin@cravingggg.com / admin123</p>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-text-muted">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
