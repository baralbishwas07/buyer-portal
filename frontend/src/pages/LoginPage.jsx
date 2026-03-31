import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, []);

  function validate() {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const result = await loginUser(email.trim(), password);

    if (result.success) {
      toast.success('Logged in successfully');
      login(result.data.user);
    } else {
      toast.error(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy tracking-tight">Buyer Portal</h1>
          <p className="text-gray-400 text-sm mt-1.5">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all duration-200 ${
                fieldErrors.email
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-accent focus:ring-accent/10'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Min. 6 characters"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all duration-200 ${
                fieldErrors.password
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-accent focus:ring-accent/10'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-navy text-white font-semibold rounded-lg cursor-pointer hover:bg-navy-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent font-medium hover:underline cursor-pointer">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
