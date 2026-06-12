import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming you use icons, but I'll just use SVG or text.
// I'll keep it simple with plain SVGs or text.
import { useState } from 'react';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Great Joe Computers" className="h-10 w-auto" />
          <span className="text-xl font-bold text-brand-700">Great Joe Computers</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Link
              to={`/catalog?search=${search}`}
              className="absolute right-3 top-2 text-gray-500 hover:text-brand-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/catalog" className="text-gray-700 hover:text-brand-700 font-medium">Catalog</Link>
          <Link to="/cart" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-brand-600 text-sm">Admin</Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-brand-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;