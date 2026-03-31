import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-navy text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-lg font-bold tracking-tight cursor-pointer hover:opacity-90 transition">
            Buyer Portal
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`text-sm px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-white/15 font-semibold'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
            >
              Properties
            </Link>
            <Link
              to="/favourites"
              className={`text-sm px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                isActive('/favourites')
                  ? 'bg-white/15 font-semibold'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
            >
              Favourites
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {user?.name}
            <span className="ml-2 bg-gold text-navy-dark text-xs font-semibold px-2 py-0.5 rounded-full uppercase">
              {user?.role}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-sm border border-white/25 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
