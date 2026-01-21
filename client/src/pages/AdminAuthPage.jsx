import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

function AdminAuthPage() {

  const { adminLogin, adminRegister } = useContext(AdminContext);

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
    name: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();


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
      return setError("Passwords do not match");
    }

    try {
      setSubmitting(true);

      if (isLogin) {
        await adminLogin(formData.email, formData.password);
      } else {
        await adminRegister(formData.name, formData.email, formData.password, formData.confirmPassword, formData.adminCode);
      }
      navigate('/admin/inventory');
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSubmitting(false);
    setFormData({
      email: '',
      password: '',
      adminCode: '',
      name: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#221d10]">
      <div className="flex flex-1 justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 rounded-xl border border-white/10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary p-3 rounded-full">
                  <svg className="w-8 h-8 text-[#181611]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#f8f8f6] mb-2">
                {isLogin ? `${submitting ? 'Submitting...' : 'Admin Portal'}` : `${submitting ? 'Submitting...' : 'Admin Registration'}`}
              </h1>
              <p className="text-[#b0a88e]">
                {isLogin ? 'Secure administrative access' : 'Create new admin account'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field - only for registration */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#f8f8f6] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-transparent text-[#f8f8f6] placeholder-[#897f61] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#f8f8f6] mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-white/10 bg-transparent text-[#f8f8f6] placeholder-[#897f61] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter admin email"
                />
              </div>

              {/* Admin Code field - only for registration */}
              {!isLogin && (
                <div>
                  <label htmlFor="adminCode" className="block text-sm font-semibold text-[#f8f8f6] mb-2">
                    Admin Authorization Code
                  </label>
                  <input
                    type="text"
                    id="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-transparent text-[#f8f8f6] placeholder-[#897f61] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Enter authorization code"
                  />
                  <p className="mt-2 text-xs text-[#897f61]">
                    Contact system administrator for authorization code
                  </p>
                </div>
              )}

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#f8f8f6] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-white/10 bg-transparent text-[#f8f8f6] placeholder-[#897f61] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password field - only for registration */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#f8f8f6] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-transparent text-[#f8f8f6] placeholder-[#897f61] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                    disabled={submitting}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-primary hover:bg-[#b8900f] text-[#181611] font-bold py-3 px-4 rounded-lg transition-all uppercase tracking-wider 
                  ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLogin ? `${submitting ? 'Submitting...' : 'Admin Sign In'}` : `${submitting ? 'Submitting...' : 'Create Admin Account'}`}
              </button>
            </form>
            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <p className="text-[#b0a88e]">
                {isLogin ? "Need admin access? " : "Already have admin access? "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-primary hover:text-[#b8900f] font-semibold transition-colors"
                >
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-[#181611]/50 border border-white/10 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-primary">Security Notice</p>
                  <p className="text-xs text-[#897f61] mt-1">
                    This is a restricted area. All access attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to User Login */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-[#897f61] hover:text-[#b0a88e] transition-colors"
              >
                ← Back to User Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuthPage;
