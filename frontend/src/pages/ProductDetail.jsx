import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.images?.length) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  if (loading || !product) return <div className="text-center py-10">Loading...</div>;

  const inStock = product.stockCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image Gallery */}
      <div>
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
          <img src={mainImage} alt={product.title} className="w-full h-full object-contain" />
        </div>
        <div className="flex mt-4 space-x-2">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt=""
              onClick={() => setMainImage(img.url)}
              className={`w-16 h-16 object-cover rounded border-2 cursor-pointer ${
                mainImage === img.url ? 'border-brand-500' : 'border-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
        <p className="text-sm text-gray-500 capitalize mt-1">{product.category}</p>
        <p className="text-2xl font-bold text-brand-700 mt-4">₦{product.price.toLocaleString()}</p>
        <p className="text-sm mt-2">
          <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
          </span>
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Technical Specifications</h2>
            <table className="w-full text-sm border">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="px-3 py-2 font-medium capitalize bg-gray-50 w-40">{key}</td>
                    <td className="px-3 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          disabled={!inStock}
          onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
          className={`mt-8 w-full md:w-auto px-8 py-3 rounded-md font-semibold text-white transition ${
            inStock
              ? 'bg-brand-500 hover:bg-brand-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;