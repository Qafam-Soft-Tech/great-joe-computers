import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProduct } from '../store/slices/productSlice';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import StarRating from './StarRating';

const QuickViewModal = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { payload } = await dispatch(fetchProduct(productId));
        setProduct(payload.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl p-8 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <FiX size={24} />
        </button>
        <div className="grid md:grid-cols-2">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.title}
            className="h-64 md:h-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold">{product.title}</h3>
            <div className="flex items-center mt-2">
              <StarRating rating={product.avgRating || 4} />
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>
            <p className="text-2xl font-bold text-brand-600 mt-4">
              ₦{product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  dispatch(addToCart({ ...product, quantity: 1 }));
                  onClose();
                }}
                className="flex items-center justify-center bg-brand-500 text-white px-6 py-3 rounded-full hover:bg-brand-700 transition w-full"
              >
                <FiShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;