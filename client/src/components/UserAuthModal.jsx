import { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function UserAuthModal({ isOpen, onClose }) {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    //Implement API call for authentication
    const {data} = await axios.post(`${backendUrl}/api/users/${isLogin ? 'login' : 'register'}`, formData);
     
    if (data.success) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      onClose();
      navigate(0);
    } else {
      alert(data.message);
      // Close modal on success
      onClose();
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-[#221d10] rounded-xl border border-[#e6e3db] dark:border-white/10 p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#897f61] hover:text-[#181611] dark:hover:text-[#f8f8f6] transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#181611] dark:text-[#f8f8f6] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#897f61] dark:text-[#b0a88e]">
              {isLogin ? 'Sign in to your account' : 'Register as a new customer'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field - only for registration */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#181611] dark:text-[#f8f8f6] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-[#e6e3db] dark:border-white/10 bg-transparent text-[#181611] dark:text-[#f8f8f6] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#181611] dark:text-[#f8f8f6] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full h-12 px-4 rounded-lg border border-[#e6e3db] dark:border-white/10 bg-transparent text-[#181611] dark:text-[#f8f8f6] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#181611] dark:text-[#f8f8f6] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full h-12 px-4 rounded-lg border border-[#e6e3db] dark:border-white/10 bg-transparent text-[#181611] dark:text-[#f8f8f6] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password field - only for registration */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#181611] dark:text-[#f8f8f6] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-[#e6e3db] dark:border-white/10 bg-transparent text-[#181611] dark:text-[#f8f8f6] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Forgot Password - only for login */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-[#b8900f] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#b8900f] text-[#181611] font-bold py-3 px-4 rounded-lg transition-all uppercase tracking-wider"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-[#897f61] dark:text-[#b0a88e]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-primary hover:text-[#b8900f] font-semibold transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuthModal;
