import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-12 mt-16">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Great Joe Computers</h3>
        <p className="text-gray-300">Your trusted tech partner in Nigeria.</p>
        <div className="flex space-x-4 mt-4">
          <a href="#" className="hover:text-brand-400">
            <FiFacebook size={20} />
          </a>
          <a href="#" className="hover:text-brand-400">
            <FiTwitter size={20} />
          </a>
          <a href="#" className="hover:text-brand-400">
            <FiInstagram size={20} />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2">
          <li>
            <Link to="/catalog" className="text-gray-300 hover:text-white">
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-300 hover:text-white">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-300 hover:text-white">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Newsletter</h4>
        <p className="text-gray-300 mb-2">Subscribe for deals & new arrivals.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
          />
          <button className="bg-brand-500 px-4 rounded-r-lg hover:bg-brand-700 transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
      © {new Date().getFullYear()} Great Joe Computers. All rights reserved.
    </div>
  </footer>
);

export default Footer;