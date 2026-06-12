import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import QuickViewModal from './QuickViewModal';
import { FiEye, FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showQuickView, setShowQuickView] = useState(false);
  const inStock = product.stockCount > 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
        <Link to={`/product/${product._id}`} className="relative block">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
          >
            <FiEye />
          </button>
        </Link>
        <div className="p-4">
          <Link
            to={`/product/${product._id}`}
            className="text-lg font-semibold text-gray-800 hover:text-brand-700 line-clamp-2"
          >
            {product.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-brand-700 font-bold text-xl">
              ₦{product.price.toLocaleString()}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {inStock ? 'In Stock' : 'Out'}
            </span>
          </div>
          <button
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            disabled={!inStock}
            className={`mt-4 w-full flex items-center justify-center py-2 rounded-lg font-semibold transition ${
              inStock
                ? 'bg-brand-500 text-white hover:bg-brand-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart className="mr-2" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal productId={product._id} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;