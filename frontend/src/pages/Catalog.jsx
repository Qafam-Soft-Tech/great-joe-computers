import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Catalog = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterInStock, setFilterInStock] = useState(false);

  useEffect(() => {
    const params = {};
    if (filterCategory) params.category = filterCategory;
    if (filterMinPrice) params.minPrice = filterMinPrice;
    if (filterMaxPrice) params.maxPrice = filterMaxPrice;
    if (filterInStock) params.inStock = 'true';
    const search = searchParams.get('search');
    if (search) params.search = search;
    dispatch(fetchProducts(params));
  }, [dispatch, filterCategory, filterMinPrice, filterMaxPrice, filterInStock, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="Laptops">Laptops</option>
              <option value="Desktops">Desktops</option>
              <option value="Accessories">Accessories</option>
              <option value="Components">Components</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Min Price (₦)</label>
            <input type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Max Price (₦)</label>
            <input type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={(e) => setFilterInStock(e.target.checked)}
              className="h-4 w-4 text-brand-600"
            />
            <label className="ml-2 text-sm">In Stock Only</label>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;