import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';

const Home = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const featured = items.slice(0, 8);

  return (
    <div>
      <HeroCarousel />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">🔥 Hot Deals</h2>
          <Link to="/catalog" className="text-brand-600 hover:underline">
            View All →
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader type="product" count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Showcase */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Laptops', 'Desktops', 'Accessories', 'Components'].map((cat) => (
              <Link
                key={cat}
                to={`/catalog?category=${cat}`}
                className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">
                  {cat === 'Laptops' ? '💻' : cat === 'Desktops' ? '🖥️' : cat === 'Accessories' ? '🎧' : '🧩'}
                </div>
                <h3 className="text-lg font-semibold">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional "New Arrivals" section could be added here */}
    </div>
  );
};

export default Home;